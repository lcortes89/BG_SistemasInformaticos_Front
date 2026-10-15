import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { syncSessionBetweenTabs } from '@/stores/auth-tabs'

function fakeToken(secondsFromNow) {
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + secondsFromNow }))
  return `header.${payload}.signature`
}

const adminSession = () => JSON.stringify({ token: fakeToken(3600), email: 'admin@bg.es', role: 'ADMIN' })

// Fake router: only what the function uses
function fakeRouter(requiresAuth = true) {
  return { currentRoute: { value: { meta: { requiresAuth } } }, push: vi.fn() }
}

// What the browser does in THIS tab when ANOTHER tab changes localStorage
function otherTabChanges(key, newValue) {
  if (newValue === null) localStorage.removeItem(key)
  else localStorage.setItem(key, newValue)
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }))
}

describe('session shared between tabs (BGSI-257)', () => {
  let stop

  beforeEach(() => {
    stop?.()
    localStorage.clear()
    localStorage.setItem('bgsi-session', adminSession())
    setActivePinia(createPinia())
  })

  it('logs out this tab and goes to the login when another tab logs out', () => {
    const store = useAuthStore()
    const router = fakeRouter()
    stop = syncSessionBetweenTabs(store, router)
    expect(store.isAdmin).toBe(true)

    otherTabChanges('bgsi-session', null)

    expect(store.isAdmin).toBe(false)
    expect(router.push).toHaveBeenCalledWith({ name: 'admin-login', query: { loggedOut: '1' } })
  })

  it('does not move a visitor who is on a public page', () => {
    const store = useAuthStore()
    const router = fakeRouter(false)
    stop = syncSessionBetweenTabs(store, router)

    otherTabChanges('bgsi-session', null)

    expect(store.isAdmin).toBe(false)
    expect(router.push).not.toHaveBeenCalled()
  })

  it('picks up a login made in another tab', () => {
    localStorage.clear()
    const store = useAuthStore()
    stop = syncSessionBetweenTabs(store, fakeRouter())
    expect(store.isAdmin).toBe(false)

    otherTabChanges('bgsi-session', adminSession())

    expect(store.isAdmin).toBe(true)
  })

  it('ignores changes of other keys', () => {
    const store = useAuthStore()
    const router = fakeRouter()
    stop = syncSessionBetweenTabs(store, router)

    otherTabChanges('something-else', 'x')

    expect(store.isAdmin).toBe(true)
    expect(router.push).not.toHaveBeenCalled()
  })
})
