import { describe, it, expect, afterEach, vi } from 'vitest'
import { fakeApi } from '../../helpers/fake-api'
import AccountService from '@/core/apis/account/AccountService'
import AuthService from '@/core/apis/auth/AuthService'

// BGSI-301: change my own email
describe('email change API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('asks for the change, reads the pending one and cancels it', async () => {
    const pending = { newEmail: 'new@bg.es', expiresAt: '2026-10-22T13:00:00Z' }
    const calls = fakeApi({
      'POST /admin/account/email': pending,
      'GET /admin/account/email': pending,
      'DELETE /admin/account/email': '',
    })
    const service = new AccountService()

    const sent = await service.requestEmailChange('  new@bg.es ')
    const read = await service.getPendingEmailChange()
    await service.cancelEmailChange()

    expect(calls[0].body).toEqual({ newEmail: 'new@bg.es' })
    expect(sent).toEqual({ newEmail: 'new@bg.es', expiresAt: new Date('2026-10-22T13:00:00Z') })
    expect(read).toEqual(sent)
    expect(calls.map((call) => call.key)).toEqual([
      'POST /admin/account/email', 'GET /admin/account/email', 'DELETE /admin/account/email',
    ])
  })

  it('returns null when nothing is pending', async () => {
    fakeApi({ 'GET /admin/account/email': { newEmail: null, expiresAt: null } })

    expect(await new AccountService().getPendingEmailChange()).toBeNull()
  })

  it('confirms the link and returns the new email', async () => {
    const calls = fakeApi({ 'POST /auth/confirm-email': { email: 'new@bg.es' } })

    expect(await new AuthService().confirmEmailChange('abc')).toBe('new@bg.es')
    expect(calls[0].body).toEqual({ token: 'abc' })
  })
})
