import { describe, it, expect, vi } from 'vitest'
import { useConfirmPasswordForm } from '@/composables/admin/useConfirmPasswordForm'

const fail = (status, details = null) => Object.assign(new Error('backend'), { status, details })

// BGSI-275: "Confirma tu contraseña"
describe('useConfirmPasswordForm', () => {
  it('asks for the password before calling the backend', async () => {
    const service = { confirmPassword: vi.fn() }
    const { error, submit } = useConfirmPasswordForm(service)

    expect(await submit()).toBeNull()
    expect(error.value).toBe('Escribe tu contraseña')
    expect(service.confirmPassword).not.toHaveBeenCalled()
  })

  it('returns the token and empties the field when the password is right', async () => {
    const service = { confirmPassword: vi.fn().mockResolvedValue({ token: 'tok', expiresInSeconds: 300 }) }
    const { password, submit } = useConfirmPasswordForm(service)
    password.value = 'Correct2026'

    expect(await submit()).toEqual({ token: 'tok', expiresInSeconds: 300 })
    expect(service.confirmPassword).toHaveBeenCalledWith('Correct2026')
    expect(password.value).toBe('')
  })

  it('shows "Contraseña incorrecta" for a 400', async () => {
    const { password, error, submit } = useConfirmPasswordForm({ confirmPassword: vi.fn().mockRejectedValue(fail(400)) })
    password.value = 'Wrong2026'

    expect(await submit()).toBeNull()
    expect(error.value).toBe('Contraseña incorrecta')
    expect(password.value).toBe('')
  })

  it('shows the minutes left after 5 wrong passwords (429)', async () => {
    const locked = fail(429, { retryAfterMinutes: '15' })
    const { password, error, submit } = useConfirmPasswordForm({ confirmPassword: vi.fn().mockRejectedValue(locked) })
    password.value = 'Wrong2026'

    await submit()

    expect(error.value).toBe('Demasiados intentos fallidos. Vuelve a intentarlo en 15 minutos.')
  })
})
