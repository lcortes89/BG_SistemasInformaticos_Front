import { describe, it, expect } from 'vitest'
import { routes } from '@/router/routes'

const byName = (name) => routes.find((route) => route.name === name)

describe('routes with the header floating over the hero', () => {
  it('are the five public pages with a hero', () => {
    ['home', 'solutions', 'rates', 'clients', 'contact'].forEach((name) => {
      expect(byName(name).meta.overlayHeader).toBe(true)
    })
  })

  it('do not include legal pages or the admin login', () => {
    expect(byName('legal-notice').meta?.overlayHeader).toBeFalsy()
    expect(byName('admin-login').meta?.overlayHeader).toBeFalsy()
  })
})
