import { describe, it, expect, vi } from 'vitest'
import AuthService from '@/core/apis/auth/AuthService'
import SessionModel from '@/core/models/auth/SessionModel'

describe('AuthService', () => {
  it('logs in with the trimmed email and returns a SessionModel', async () => {
    const fakeRepository = {
      login: vi.fn().mockResolvedValue({ token: 'abc', email: 'admin@bg.es', role: 'ADMIN' }),
    }

    const session = await new AuthService(fakeRepository).login('  admin@bg.es ', 'secret123')

    expect(fakeRepository.login).toHaveBeenCalledWith('admin@bg.es', 'secret123')
    expect(session).toBeInstanceOf(SessionModel)
    expect(session.isAdmin()).toBe(true)
  })
})
