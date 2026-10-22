import { describe, it, expect, vi } from 'vitest'
import { useAdminUsers } from '@/composables/admin/useAdminUsers'
import AdminUserModel from '@/core/models/adminuser/AdminUserModel'

const maria = new AdminUserModel(2, 'maria@bg.es', 'ACTIVE', true, null, false)
const error = (status, message = 'Error') => Object.assign(new Error(message), { status })

// BGSI-277
describe('useAdminUsers', () => {
  it('loads the list', async () => {
    const service = { getAll: vi.fn().mockResolvedValue([maria]) }
    const { admins, load } = useAdminUsers(service)

    await load()

    expect(admins.value).toEqual([maria])
  })

  it('shows the error when the list cannot be loaded', async () => {
    const { error: loadError, load } = useAdminUsers({ getAll: vi.fn().mockRejectedValue(error(500, 'Servidor caído')) })

    await load()

    expect(loadError.value).toBe('Servidor caído')
  })

  it('runs an action, shows what happened and reloads the list', async () => {
    const service = { getAll: vi.fn().mockResolvedValue([maria]), block: vi.fn().mockResolvedValue(maria) }
    const { feedback, run } = useAdminUsers(service)

    expect(await run('block', maria)).toBe(true)

    expect(service.block).toHaveBeenCalledWith(2)
    expect(feedback.value).toBe('maria@bg.es está bloqueado. Ya no puede entrar al panel.')
    expect(service.getAll).toHaveBeenCalled()
  })

  it('has a message for every action', async () => {
    const service = {
      getAll: vi.fn().mockResolvedValue([]),
      unblock: vi.fn(), resetTwoFactor: vi.fn(), resendInvitation: vi.fn(), remove: vi.fn(),
    }
    const { feedback, run } = useAdminUsers(service)

    await run('unblock', maria)
    expect(feedback.value).toContain('puede volver a entrar')
    await run('resetTwoFactor', maria)
    expect(feedback.value).toContain('Se ha quitado la verificación en dos pasos')
    await run('resendInvitation', maria)
    expect(feedback.value).toContain('Invitación reenviada')
    await run('remove', maria)
    expect(feedback.value).toBe('maria@bg.es se ha borrado.')
  })

  it('does nothing when the password dialog is closed (BGSI-275)', async () => {
    const cancelled = Object.assign(new Error('Acción cancelada'), { cancelled: true })
    const service = { getAll: vi.fn(), block: vi.fn().mockRejectedValue(cancelled) }
    const { feedback, actionError, run } = useAdminUsers(service)

    expect(await run('block', maria)).toBe(false)

    expect(feedback.value).toBeNull()
    expect(actionError.value).toBeNull()
  })

  it('explains a 409 and reloads the list (the admin changed meanwhile)', async () => {
    const service = { getAll: vi.fn().mockResolvedValue([maria]), block: vi.fn().mockRejectedValue(error(409)) }
    const { actionError, run } = useAdminUsers(service)

    await run('block', maria)

    expect(actionError.value).toContain('el estado de este administrador ha cambiado')
    expect(service.getAll).toHaveBeenCalled()
  })

  it('shows the message of other errors', async () => {
    const { actionError, run } = useAdminUsers({ remove: vi.fn().mockRejectedValue(error(500, 'Servidor caído')) })

    await run('remove', maria)

    expect(actionError.value).toBe('Servidor caído')
  })

  it('after an invitation says it was sent and reloads', async () => {
    const service = { getAll: vi.fn().mockResolvedValue([maria]) }
    const { feedback, invited } = useAdminUsers(service)

    await invited('nuevo@bg.es')

    expect(feedback.value).toBe('Invitación enviada a nuevo@bg.es. Tiene 24 horas para crear su contraseña.')
    expect(service.getAll).toHaveBeenCalled()
  })
})
