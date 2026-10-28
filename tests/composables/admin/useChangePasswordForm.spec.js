import { describe, it, expect, vi } from 'vitest'
import { useChangePasswordForm, passwordRules } from '@/composables/admin/useChangePasswordForm'

const fakeStore = () => ({ replaceToken: vi.fn() })

function fill(form, current, next, confirm = next) {
  form.currentPassword = current
  form.newPassword = next
  form.confirmPassword = confirm
}

describe('useChangePasswordForm (BGSI-272)', () => {
  it('checks each rule of the new password', () => {
    const ok = (password, current) => Object.fromEntries(passwordRules(password, current).map((r) => [r.key, r.ok]))

    expect(ok('short', 'x')).toEqual({ length: false, upper: false, lower: true, number: false, different: true })
    expect(ok('Ribadeo2026', 'x')).toEqual({ length: true, upper: true, lower: true, number: true, different: true })
    expect(ok('Ribadeo2026', 'Ribadeo2026').different).toBe(false)
    expect(ok('A1' + 'a'.repeat(71), 'x').length).toBe(false) // 73 characters
  })

  it('does not call the backend when fields are empty or do not match', async () => {
    const service = { changePassword: vi.fn() }
    const { form, errors, submit } = useChangePasswordForm(service, fakeStore())

    expect(await submit()).toBe(false)
    expect(Object.keys(errors)).toEqual(['currentPassword', 'newPassword', 'confirmPassword'])

    fill(form, 'OldPass2026', 'weak', 'other')
    await submit()
    expect(errors.newPassword).toBe('La nueva contraseña no cumple todos los requisitos')
    expect(errors.confirmPassword).toBe('Las contraseñas no coinciden')
    expect(service.changePassword).not.toHaveBeenCalled()
  })

  it('saves the new token, shows the message and clears the form', async () => {
    const service = { changePassword: vi.fn().mockResolvedValue('new-token') }
    const store = fakeStore()
    const { form, successMessage, submit } = useChangePasswordForm(service, store)
    fill(form, 'OldPass2026', 'NewPass2026')

    expect(await submit()).toBe(true)

    expect(service.changePassword).toHaveBeenCalledWith('OldPass2026', 'NewPass2026')
    expect(store.replaceToken).toHaveBeenCalledWith('new-token')
    expect(successMessage.value).toContain('Contraseña actualizada')
    expect(form).toEqual({ currentPassword: '', newPassword: '', confirmPassword: '' })
  })

  it('marks the current password when the backend says it is wrong', async () => {
    const error = Object.assign(new Error('Current password is not correct'), {
      status: 400, details: { currentPassword: 'Current password is not correct' },
    })
    const { form, errors, submitError, submit } = useChangePasswordForm(
      { changePassword: vi.fn().mockRejectedValue(error) }, fakeStore())
    fill(form, 'Wrong2026x', 'NewPass2026')

    expect(await submit()).toBe(false)
    expect(errors.currentPassword).toBe('La contraseña actual no es correcta')
    expect(submitError.value).toBeNull()
  })

  it('marks the new password or shows a general error for other failures', async () => {
    const sameError = Object.assign(new Error('same'), { status: 400, details: { newPassword: 'same' } })
    const first = useChangePasswordForm({ changePassword: vi.fn().mockRejectedValue(sameError) }, fakeStore())
    fill(first.form, 'OldPass2026', 'NewPass2026')
    await first.submit()
    expect(first.errors.newPassword).toBe('La nueva contraseña no es válida o es igual a la actual')

    const serverError = Object.assign(new Error('Ha ocurrido un error en el servidor.'), { status: 500 })
    const second = useChangePasswordForm({ changePassword: vi.fn().mockRejectedValue(serverError) }, fakeStore())
    fill(second.form, 'OldPass2026', 'NewPass2026')
    await second.submit()
    expect(second.submitError.value).toBe('Ha ocurrido un error en el servidor.')
  })
})

describe('useChangePasswordForm: two steps (BGSI-294)', () => {
  it('only goes to step 2 when the current and the new password are valid', () => {
    const { form, errors, step, next } = useChangePasswordForm({ changePassword: vi.fn() }, fakeStore())

    expect(next()).toBe(false)
    expect(Object.keys(errors)).toEqual(['currentPassword', 'newPassword'])

    form.currentPassword = 'OldPass2026'
    form.newPassword = 'NewPass2026'
    expect(next()).toBe(true)
    expect(step.value).toBe(2)
  })

  it('goes back to step 1 when the backend says the current password is wrong', async () => {
    const error = Object.assign(new Error('wrong'), { status: 400, details: { currentPassword: 'wrong' } })
    const { form, step, next, submit } = useChangePasswordForm(
      { changePassword: vi.fn().mockRejectedValue(error) }, fakeStore())
    fill(form, 'Wrong2026x', 'NewPass2026')
    next()

    await submit()

    expect(step.value).toBe(1)
    expect(form.confirmPassword).toBe('')
  })
})
