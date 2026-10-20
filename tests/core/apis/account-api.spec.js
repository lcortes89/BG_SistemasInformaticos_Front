import { describe, it, expect, afterEach, vi } from 'vitest'
import { fakeApi } from '../../helpers/fake-api'
import AccountService from '@/core/apis/account/AccountService'

// BGSI-272: PUT /api/admin/account/password
describe('AccountService', () => {
  afterEach(() => vi.restoreAllMocks())

  it('sends both passwords and returns the new token', async () => {
    const calls = fakeApi({ 'PUT /admin/account/password': { token: 'new-token' } })

    const token = await new AccountService().changePassword('OldPass2026', 'NewPass2026')

    expect(token).toBe('new-token')
    expect(calls[0].body).toEqual({ currentPassword: 'OldPass2026', newPassword: 'NewPass2026' })
  })
})
