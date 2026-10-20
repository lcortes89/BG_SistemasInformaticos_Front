import { describe, it, expect, vi } from 'vitest'
import { lockedMessage, useLoginForm } from '@/composables/admin/useLoginForm'

describe('useLoginForm', () => {
  it('does not log in and shows errors when the fields are empty', async () => {
    const fakeStore = { login: vi.fn() }
    const { errors, submit } = useLoginForm(fakeStore)

    const loggedIn = await submit()

    expect(loggedIn).toBe(false)
    expect(fakeStore.login).not.toHaveBeenCalled()
    expect(Object.keys(errors)).toEqual(['email', 'password'])
  })

  it('logs in with valid credentials', async () => {
    const fakeStore = { login: vi.fn().mockResolvedValue() }
    const { form, submit } = useLoginForm(fakeStore)
    form.email = 'admin@bg.es'
    form.password = 'secret123'

    const loggedIn = await submit()

    expect(loggedIn).toBe(true)
    expect(fakeStore.login).toHaveBeenCalledWith('admin@bg.es', 'secret123')
  })

  it('shows a generic message when the credentials are wrong (401)', async () => {
    const error = Object.assign(new Error('You must log in to access this resource'), { status: 401 })
    const fakeStore = { login: vi.fn().mockRejectedValue(error) }
    const { form, submitError, submit } = useLoginForm(fakeStore)
    form.email = 'admin@bg.es'
    form.password = 'wrong-pass'

    await submit()

    expect(submitError.value).toBe('Email o contraseña incorrectos')
    expect(form.password).toBe('')
  })

  it('explains in Spanish how long the account is locked (429, BGSI-284)', async () => {
    const error = Object.assign(new Error('Too many failed attempts. Try again in 15 minutes'), {
      status: 429, details: { retryAfterMinutes: '15' },
    })
    const { form, submitError, submit } = useLoginForm({ login: vi.fn().mockRejectedValue(error) })
    form.email = 'admin@bg.es'
    form.password = 'Correct2026'

    await submit()

    expect(submitError.value).toBe('Demasiados intentos fallidos. Vuelve a intentarlo en 15 minutos.')
    expect(form.password).toBe('')
  })

  it('writes "minuto" in singular and has a message without minutes', () => {
    expect(lockedMessage('1')).toBe('Demasiados intentos fallidos. Vuelve a intentarlo en 1 minuto.')
    expect(lockedMessage(undefined)).toBe('Demasiados intentos fallidos. Espera unos minutos y vuelve a intentarlo.')
  })
})
