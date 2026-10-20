import { describe, it, expect, afterEach, vi } from 'vitest'
import { fakeApi } from '../../../helpers/fake-api'
import AuthService from '@/core/apis/auth/AuthService'
import BaseRepository from '@/core/apis/base/BaseRepository'

// BGSI-273: POST /api/auth/forgot-password and /api/auth/reset-password
describe('AuthService: forgot password', () => {
  afterEach(() => vi.restoreAllMocks())

  it('asks for the email with the trimmed address', async () => {
    const calls = fakeApi({ 'POST /auth/forgot-password': '' })

    await new AuthService().forgotPassword('  admin@bg.com ')

    expect(calls[0].body).toEqual({ email: 'admin@bg.com' })
  })

  it('sends the token of the link and the new password', async () => {
    const calls = fakeApi({ 'POST /auth/reset-password': '' })

    await new AuthService().resetPassword('abc123', 'NewPass2026')

    expect(calls[0].body).toEqual({ token: 'abc123', newPassword: 'NewPass2026' })
  })
})

describe('BaseRepository.messageFor: 404', () => {
  it('explains a generic 404 (old backend without the endpoint)', () => {
    expect(BaseRepository.messageFor(404, 'Not Found')).toBe('No se ha encontrado el recurso. Comprueba que el servidor está actualizado.')
    expect(BaseRepository.messageFor(404, undefined)).toContain('No se ha encontrado el recurso')
  })

  it('keeps a specific 404 message of the backend', () => {
    expect(BaseRepository.messageFor(404, 'Brand not found')).toBe('Brand not found')
  })
})
