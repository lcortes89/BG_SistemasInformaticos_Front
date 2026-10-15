import { describe, it, expect } from 'vitest'
import { routes } from '@/router/routes'

const byName = (name) => routes.find((route) => route.name === name)

describe('routes and the public menu of the header (BGSI-256)', () => {
  it('hides the menu only in the admin login', () => {
    expect(byName('admin-login').meta?.hideNav).toBe(true)
    ;['home', 'solutions', 'rates', 'clients', 'contact'].forEach((name) => {
      expect(byName(name).meta?.hideNav).toBeFalsy()
    })
  })
})
