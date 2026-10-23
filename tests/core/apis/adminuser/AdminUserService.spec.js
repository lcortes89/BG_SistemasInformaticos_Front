import { describe, it, expect, vi } from 'vitest'
import AdminUserService from '@/core/apis/adminuser/AdminUserService'
import AdminUserModel from '@/core/models/adminuser/AdminUserModel'

const dto = { id: 2, email: 'maria@bg.es', status: 'ACTIVE', twoFactorEnabled: true, lastLoginAt: null, you: false }

// BGSI-277
describe('AdminUserService', () => {
  // BGSI-316: one page, like the other admin lists
  it('returns one page of admins as models', async () => {
    const repo = { findPage: vi.fn().mockResolvedValue({ content: [dto], page: 1, totalPages: 2, totalElements: 6 }) }

    const result = await new AdminUserService(repo).getPage(1, 5)

    expect(repo.findPage).toHaveBeenCalledWith(1, 5)
    expect(result.items[0]).toBeInstanceOf(AdminUserModel)
    expect(result.items[0].email).toBe('maria@bg.es')
    expect(result).toMatchObject({ page: 1, totalPages: 2, totalElements: 6 })
  })

  it('invites with the email trimmed and in lowercase', async () => {
    const repo = { invite: vi.fn().mockResolvedValue({ ...dto, email: 'nuevo@bg.es', status: 'PENDING' }) }

    const invited = await new AdminUserService(repo).invite('  Nuevo@BG.es ')

    expect(repo.invite).toHaveBeenCalledWith('nuevo@bg.es')
    expect(invited.isPending()).toBe(true)
  })

  it('calls the repository for each action with the id', async () => {
    const repo = {
      block: vi.fn().mockResolvedValue({ ...dto, status: 'BLOCKED' }),
      unblock: vi.fn().mockResolvedValue(dto),
      resetTwoFactor: vi.fn().mockResolvedValue({ ...dto, twoFactorEnabled: false }),
      resendInvitation: vi.fn().mockResolvedValue(),
      remove: vi.fn().mockResolvedValue(),
    }
    const service = new AdminUserService(repo)

    expect((await service.block(2)).isBlocked()).toBe(true)
    expect((await service.unblock(2)).isActive()).toBe(true)
    expect((await service.resetTwoFactor(2)).twoFactorEnabled).toBe(false)
    await service.resendInvitation(2)
    await service.remove(2)

    for (const call of Object.values(repo)) expect(call).toHaveBeenCalledWith(2)
  })
})
