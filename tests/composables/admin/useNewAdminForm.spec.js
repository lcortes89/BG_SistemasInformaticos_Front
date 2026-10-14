import { describe, it, expect, vi } from 'vitest'
import { useNewAdminForm } from '@/composables/admin/useNewAdminForm'

function fill(form, email, password, confirmPassword = password) {
  form.email = email
  form.password = password
  form.confirmPassword = confirmPassword
}

describe('useNewAdminForm (BGSI-197)', () => {
  it('does not call the backend and shows errors when the fields are empty', async () => {
    const fakeService = { registerAdmin: vi.fn() }
    const { errors, submit } = useNewAdminForm(fakeService)

    const created = await submit()

    expect(created).toBe(false)
    expect(fakeService.registerAdmin).not.toHaveBeenCalled()
    expect(Object.keys(errors)).toEqual(['email', 'password', 'confirmPassword'])
  })

  it('asks for 8 characters and for both passwords to match', async () => {
    const { form, errors, submit } = useNewAdminForm({ registerAdmin: vi.fn() })
    fill(form, 'maria@bg.es', '1234', '12345')

    await submit()

    expect(errors.password).toBe('Mínimo 8 caracteres')
    expect(errors.confirmPassword).toBe('Las contraseñas no coinciden')
  })

  it('creates the admin, shows a success message and empties the form', async () => {
    const fakeService = { registerAdmin: vi.fn().mockResolvedValue('maria@bg.es') }
    const { form, successMessage, submit } = useNewAdminForm(fakeService)
    fill(form, 'maria@bg.es', 'Segura2026')

    const created = await submit()

    expect(created).toBe(true)
    expect(fakeService.registerAdmin).toHaveBeenCalledWith('maria@bg.es', 'Segura2026')
    expect(successMessage.value).toContain('maria@bg.es')
    expect(form).toEqual({ email: '', password: '', confirmPassword: '' })
  })

  it('shows a clear message when the email already exists (409)', async () => {
    const error = Object.assign(new Error('Email already registered'), { status: 409 })
    const { form, submitError, submit } = useNewAdminForm({ registerAdmin: vi.fn().mockRejectedValue(error) })
    fill(form, 'admin@bg.es', 'Segura2026')

    const created = await submit()

    expect(created).toBe(false)
    expect(submitError.value).toBe('Ya existe un administrador con ese email')
  })
})
