import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import SessionModel from '@/core/models/auth/SessionModel'

// Builds a fake JWT whose "exp" is X seconds from now
function fakeToken(secondsFromNow) {
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + secondsFromNow }))
  return `header.${payload}.signature`
}

// BGSI-272: after changing the password the tab keeps working with the new token
describe('auth store · replaceToken', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('keeps the email and role and saves the new token', async () => {
    const store = useAuthStore()
    await store.login('a@bg.es', 'x', { login: vi.fn().mockResolvedValue(new SessionModel(fakeToken(60), 'a@bg.es', 'ADMIN')) })
    const newToken = fakeToken(3600)

    store.replaceToken(newToken)

    expect(store.token).toBe(newToken)
    expect(store.email).toBe('a@bg.es')
    expect(store.isAdmin).toBe(true)
    expect(JSON.parse(localStorage.getItem('bgsi-session')).token).toBe(newToken)
  })

  it('does nothing when nobody is logged in', () => {
    const store = useAuthStore()

    store.replaceToken(fakeToken(3600))

    expect(store.isAuthenticated).toBe(false)
  })
})
