import { describe, it, expect, vi } from 'vitest'
import { adminGuard } from '@/router/guards'

const dashboard = { name: 'admin-dashboard', fullPath: '/admin', meta: { requiresAuth: true } }
const login = { name: 'admin-login', fullPath: '/admin/login', meta: {} }
const home = { name: 'home', fullPath: '/', meta: {} }

function fakeStore({ session = null, isAuthenticated = false, isAdmin = false } = {}) {
  return { session, isAuthenticated, isAdmin, logout: vi.fn() }
}

describe('adminGuard', () => {
  it('lets anyone open public pages', () => {
    expect(adminGuard(home, fakeStore())).toBe(true)
  })

  it('sends visitors without a session to the login, remembering where they wanted to go', () => {
    expect(adminGuard(dashboard, fakeStore())).toEqual({ name: 'admin-login', query: { redirect: '/admin' } })
  })

  it('lets a logged-in admin open the dashboard', () => {
    expect(adminGuard(dashboard, fakeStore({ session: {}, isAuthenticated: true, isAdmin: true }))).toBe(true)
  })

  it('clears an expired session and explains it on the login page', () => {
    const store = fakeStore({ session: {}, isAuthenticated: false })

    const result = adminGuard(dashboard, store)

    expect(store.logout).toHaveBeenCalled()
    expect(result).toEqual({ name: 'admin-login', query: { redirect: '/admin', expired: '1' } })
  })

  it('sends a logged-in admin from the login page to the dashboard', () => {
    expect(adminGuard(login, fakeStore({ session: {}, isAuthenticated: true, isAdmin: true })))
      .toEqual({ name: 'admin-dashboard' })
  })
})
