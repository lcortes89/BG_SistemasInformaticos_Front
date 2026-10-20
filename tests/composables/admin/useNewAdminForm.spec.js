import { describe, it, expect, vi } from 'vitest'
import { useNewAdminForm } from '@/composables/admin/useNewAdminForm'

function fill(form, email, password, confirmPassword = password, confirmEmail = email) {
  form.email = email
  form.password = password
  form.confirmEmail = confirmEmail
  form.confirmPassword = confirmPassword
}

const empty = { email: '', password: '', confirmEmail: '', confirmPassword: '' }

describe('useNewAdminForm (BGSI-197)', () => {
  it('does not call the backend and shows errors when the fields are empty', async () => {
    const fakeService = { registerAdmin: vi.fn() }
    const { errors, submit } = useNewAdminForm(fakeService)

    const created = await submit()

    expect(created).toBe(false)
    expect(fakeService.registerAdmin).not.toHaveBeenCalled()
    expect(Object.keys(errors)).toEqual(['email', 'password', 'confirmEmail', 'confirmPassword'])
  })

  it('asks for 8 characters and for both passwords and emails to match', async () => {
    const { form, errors, submit } = useNewAdminForm({ registerAdmin: vi.fn() })
    fill(form, 'maria@bg.es', '1234', '12345', 'maria@bg.e')

    await submit()

    expect(errors.password).toBe('Mínimo 8 caracteres')
    expect(errors.confirmPassword).toBe('Las contraseñas no coinciden')
    expect(errors.confirmEmail).toBe('Los dos emails no coinciden')
  })

  it('accepts the repeated email with other upper or lower case letters', async () => {
    const fakeService = { registerAdmin: vi.fn().mockResolvedValue('maria@bg.es') }
    const { form, submit } = useNewAdminForm(fakeService)
    fill(form, 'maria@bg.es', 'Segura2026', 'Segura2026', ' MARIA@bg.es ')

    expect(await submit()).toBe(true)
  })

  it('creates the admin, shows a success message, empties the form and goes back to step 1', async () => {
    const fakeService = { registerAdmin: vi.fn().mockResolvedValue('maria@bg.es') }
    const { form, step, next, successMessage, submit } = useNewAdminForm(fakeService)
    fill(form, 'maria@bg.es', 'Segura2026')
    next()

    const created = await submit()

    expect(created).toBe(true)
    expect(fakeService.registerAdmin).toHaveBeenCalledWith('maria@bg.es', 'Segura2026')
    expect(successMessage.value).toContain('maria@bg.es')
    expect(form).toEqual(empty)
    expect(step.value).toBe(1)
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

describe('useNewAdminForm: two steps (BGSI-294)', () => {
  it('only goes to step 2 when the email and the password are valid', () => {
    const { form, errors, step, next } = useNewAdminForm({ registerAdmin: vi.fn() })

    expect(next()).toBe(false)
    expect(Object.keys(errors)).toEqual(['email', 'password'])

    form.email = 'maria@bg.es'
    form.password = 'Segura2026'
    expect(next()).toBe(true)
    expect(step.value).toBe(2)
  })

  it('closing "Confirma tu contraseña" keeps the form without an error (BGSI-275)', async () => {
    const { form, submitError, successMessage, submit } = useNewAdminForm({ registerAdmin: vi.fn().mockRejectedValue(Object.assign(new Error('Acción cancelada'), { cancelled: true })) })
    fill(form, 'maria@bg.es', 'Segura2026')

    expect(await submit()).toBe(false)
    expect(submitError.value).toBeNull()
    expect(successMessage.value).toBeNull()
    expect(form.email).toBe('maria@bg.es')
  })

  it('going back keeps the email and empties the repeated fields', () => {
    const { form, step, next, back } = useNewAdminForm({ registerAdmin: vi.fn() })
    fill(form, 'maria@bg.es', 'Segura2026')
    next()

    back()

    expect(step.value).toBe(1)
    expect(form).toEqual({ email: 'maria@bg.es', password: 'Segura2026', confirmEmail: '', confirmPassword: '' })
  })
})
