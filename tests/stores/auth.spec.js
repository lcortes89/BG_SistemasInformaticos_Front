import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import SessionModel from '@/core/models/auth/SessionModel'

// Builds a fake JWT whose "exp" is X seconds from now
function fakeToken(secondsFromNow) {
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + secondsFromNow }))
  return `header.${payload}.signature`
}

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('saves the session after logging in', async () => {
    const session = new SessionModel(fakeToken(3600), 'admin@bg.es', 'ADMIN')
    const fakeService = { login: vi.fn().mockResolvedValue(session) }
    const store = useAuthStore()

    await store.login('admin@bg.es', 'secret123', fakeService)

    expect(store.isAuthenticated).toBe(true)
    expect(store.isAdmin).toBe(true)
    expect(store.email).toBe('admin@bg.es')
    expect(localStorage.getItem('bgsi-session')).toContain('admin@bg.es')
  })

  it('forgets the reason of the last logout after a new login (BGSI-268)', async () => {
    localStorage.setItem('bgsi-logout-reason', 'idle')
    const session = new SessionModel(fakeToken(3600), 'admin@bg.es', 'ADMIN')

    await useAuthStore().login('admin@bg.es', 'secret123', { login: vi.fn().mockResolvedValue(session) })

    expect(localStorage.getItem('bgsi-logout-reason')).toBeNull()
  })

  it('removes the session after logging out', async () => {
    const fakeService = { login: vi.fn().mockResolvedValue(new SessionModel(fakeToken(3600), 'a@bg.es', 'ADMIN')) }
    const store = useAuthStore()
    await store.login('a@bg.es', 'secret123', fakeService)

    store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('bgsi-session')).toBeNull()
  })

  it('treats an expired token as not authenticated', () => {
    localStorage.setItem('bgsi-session', JSON.stringify({ token: fakeToken(-60), email: 'a@bg.es', role: 'ADMIN' }))

    const store = useAuthStore()

    expect(store.isAuthenticated).toBe(false)
  })
})
