import { describe, it, expect, afterEach, vi } from 'vitest'
import { fakeApi } from '../../../helpers/fake-api'
import AuthService from '@/core/apis/auth/AuthService'

// BGSI-240: page of the link that verifies the email of a new admin
describe('email verification API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('sends the token of the link to verify the email', async () => {
    const calls = fakeApi({ 'POST /auth/verify-email': '' })

    await new AuthService().verifyEmail('abc')

    expect(calls[0].key).toBe('POST /auth/verify-email')
    expect(calls[0].body).toEqual({ token: 'abc' })
  })

  it('sends the old token to ask for a new link', async () => {
    const calls = fakeApi({ 'POST /auth/verify-email/resend': '' })

    await new AuthService().resendVerification('abc')

    expect(calls[0].key).toBe('POST /auth/verify-email/resend')
    expect(calls[0].body).toEqual({ token: 'abc' })
  })
})
