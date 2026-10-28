import { describe, it, expect, vi } from 'vitest'
import { useInviteAdminForm } from '@/composables/admin/useInviteAdminForm'

const error = (props) => Object.assign(new Error('Error'), props)

async function fillAndSend(form, next, submit, email = 'nuevo@bg.es', repeated = email) {
  form.email = email
  next()
  form.confirmEmail = repeated
  return submit()
}

// BGSI-277: "Invitar administrador" in two steps (BGSI-294)
describe('useInviteAdminForm', () => {
  it('does not go on without a valid email', () => {
    const { form, errors, step, next } = useInviteAdminForm({ invite: vi.fn() })

    next()
    expect(errors.email).toBe('El email es obligatorio')
    form.email = 'no-es-un-email'
    next()
    expect(errors.email).toBe('El formato del email no es válido')
    expect(step.value).toBe(1)
  })

  it('needs the same email twice', async () => {
    const service = { invite: vi.fn() }
    const { form, errors, next, submit } = useInviteAdminForm(service)

    expect(await fillAndSend(form, next, submit, 'nuevo@bg.es', 'nuveo@bg.es')).toBeNull()

    expect(errors.confirmEmail).toBe('Los dos emails no coinciden')
    expect(service.invite).not.toHaveBeenCalled()
  })

  it('sends the invitation, returns the email and empties the form', async () => {
    const service = { invite: vi.fn().mockResolvedValue({ email: 'nuevo@bg.es' }) }
    const { form, step, next, submit } = useInviteAdminForm(service)

    expect(await fillAndSend(form, next, submit, 'Nuevo@bg.es', 'nuevo@BG.es')).toBe('nuevo@bg.es')

    expect(service.invite).toHaveBeenCalledWith('Nuevo@bg.es')
    expect(form.email).toBe('')
    expect(step.value).toBe(1)
  })

  it('explains that the email already exists (409)', async () => {
    const { form, submitError, next, submit } = useInviteAdminForm({ invite: vi.fn().mockRejectedValue(error({ status: 409 })) })

    await fillAndSend(form, next, submit)

    expect(submitError.value).toBe('Ya existe un administrador con ese email')
  })

  it('keeps the form when the password dialog is closed (BGSI-275)', async () => {
    const { form, submitError, step, next, submit } = useInviteAdminForm({ invite: vi.fn().mockRejectedValue(error({ cancelled: true })) })

    await fillAndSend(form, next, submit)

    expect(submitError.value).toBeNull()
    expect(form.email).toBe('nuevo@bg.es')
    expect(step.value).toBe(2)
  })

  it('going back empties the repeated email', () => {
    const { form, step, next, back } = useInviteAdminForm({ invite: vi.fn() })
    form.email = 'nuevo@bg.es'
    next()
    form.confirmEmail = 'nuevo@bg.es'

    back()

    expect(step.value).toBe(1)
    expect(form.confirmEmail).toBe('')
  })
})
