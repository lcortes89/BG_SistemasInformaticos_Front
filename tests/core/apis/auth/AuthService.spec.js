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

  it('registers a new admin with the trimmed email and returns that email (BGSI-197)', async () => {
    const fakeRepository = {
      register: vi.fn().mockResolvedValue({ id: 2, email: 'maria@bg.es', role: 'ADMIN' }),
    }

    const email = await new AuthService(fakeRepository).registerAdmin(' maria@bg.es ', 'Segura2026')

    expect(fakeRepository.register).toHaveBeenCalledWith('maria@bg.es', 'Segura2026')
    expect(email).toBe('maria@bg.es')
  })
})
