import { describe, it, expect, vi } from 'vitest'
import { useForgotPasswordForm, useResetPasswordForm } from '@/composables/admin/usePasswordResetForms'

const apiError = (status, details = null, message = 'error') => Object.assign(new Error(message), { status, details })

describe('useForgotPasswordForm (BGSI-273)', () => {
  it('asks for an email', async () => {
    const service = { forgotPassword: vi.fn() }
    const { errors, submit } = useForgotPasswordForm(service)

    expect(await submit()).toBe(false)
    expect(errors.email).toBe('El email es obligatorio')
    expect(service.forgotPassword).not.toHaveBeenCalled()
  })

  it('rejects an email with a wrong format', async () => {
    const { form, errors, submit } = useForgotPasswordForm({ forgotPassword: vi.fn() })
    form.email = 'admin@'

    await submit()

    expect(errors.email).toBe('El formato del email no es válido')
  })

  it('shows the "check your email" message after sending', async () => {
    const service = { forgotPassword: vi.fn().mockResolvedValue() }
    const { form, isSent, submit } = useForgotPasswordForm(service)
    form.email = 'admin@bg.com'

    expect(await submit()).toBe(true)
    expect(service.forgotPassword).toHaveBeenCalledWith('admin@bg.com')
    expect(isSent.value).toBe(true)
  })

  it('shows the error when the server cannot be reached', async () => {
    const service = { forgotPassword: vi.fn().mockRejectedValue(apiError(undefined, null, 'No se pudo conectar')) }
    const { form, isSent, submitError, isSubmitting, submit } = useForgotPasswordForm(service)
    form.email = 'admin@bg.com'

    expect(await submit()).toBe(false)
    expect(isSent.value).toBe(false)
    expect(submitError.value).toBe('No se pudo conectar')
    expect(isSubmitting.value).toBe(false)
  })
})

describe('useResetPasswordForm (BGSI-273)', () => {
  it('marks the link as invalid when there is no token', async () => {
    const service = { resetPassword: vi.fn() }
    const { isInvalidLink, submit } = useResetPasswordForm('', service)

    expect(isInvalidLink.value).toBe(true)
    expect(await submit()).toBe(false)
    expect(service.resetPassword).not.toHaveBeenCalled()
  })

  it('does not include the "different from the current one" rule', () => {
    const { rules } = useResetPasswordForm('tok', {})

    expect(rules.value.map((rule) => rule.key)).toEqual(['length', 'upper', 'lower', 'number'])
  })

  it('validates the new password and the confirmation', async () => {
    const { form, errors, submit } = useResetPasswordForm('tok', { resetPassword: vi.fn() })

    await submit()
    expect(errors.newPassword).toBe('Escribe la nueva contraseña')
    expect(errors.confirmPassword).toBe('Repite la nueva contraseña')

    form.newPassword = 'short'
    form.confirmPassword = 'other'
    await submit()
    expect(errors.newPassword).toBe('La nueva contraseña no cumple todos los requisitos')
    expect(errors.confirmPassword).toBe('Las contraseñas no coinciden')
  })

  it('sends the token and the new password', async () => {
    const service = { resetPassword: vi.fn().mockResolvedValue() }
    const { form, submit } = useResetPasswordForm('tok', service)
    form.newPassword = form.confirmPassword = 'NewPass2026'

    expect(await submit()).toBe(true)
    expect(service.resetPassword).toHaveBeenCalledWith('tok', 'NewPass2026')
  })

  it('marks the link as invalid when the backend rejects the token', async () => {
    const service = { resetPassword: vi.fn().mockRejectedValue(apiError(400)) }
    const { form, isInvalidLink, submit } = useResetPasswordForm('used-token', service)
    form.newPassword = form.confirmPassword = 'NewPass2026'

    expect(await submit()).toBe(false)
    expect(isInvalidLink.value).toBe(true)
  })

  it('shows the backend password error on the field', async () => {
    const service = { resetPassword: vi.fn().mockRejectedValue(apiError(400, { newPassword: 'size' })) }
    const { form, errors, isInvalidLink, submit } = useResetPasswordForm('tok', service)
    form.newPassword = form.confirmPassword = 'NewPass2026'

    await submit()

    expect(errors.newPassword).toBe('La nueva contraseña no cumple todos los requisitos')
    expect(isInvalidLink.value).toBe(false)
  })

  it('shows other errors as an alert', async () => {
    const service = { resetPassword: vi.fn().mockRejectedValue(apiError(500, null, 'Error del servidor')) }
    const { form, submitError, submit } = useResetPasswordForm('tok', service)
    form.newPassword = form.confirmPassword = 'NewPass2026'

    await submit()

    expect(submitError.value).toBe('Error del servidor')
  })
})

describe('useResetPasswordForm: two steps (BGSI-294)', () => {
  it('only goes to step 2 with a valid new password and goes back when the backend rejects it', async () => {
    const error = Object.assign(new Error('size'), { status: 400, details: { newPassword: 'size' } })
    const { form, step, next, back, submit } = useResetPasswordForm('tok', { resetPassword: vi.fn().mockRejectedValue(error) })

    form.newPassword = 'short'
    expect(next()).toBe(false)

    form.newPassword = 'NewPass2026'
    expect(next()).toBe(true)
    form.confirmPassword = 'NewPass2026'
    await submit()
    expect(step.value).toBe(1)

    next()
    form.confirmPassword = 'x'
    back()
    expect(form.confirmPassword).toBe('')
  })
})
