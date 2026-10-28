import { describe, it, expect } from 'vitest'
import { routes } from '@/router/routes'

const byName = (name) => routes.find((route) => route.name === name)

describe('routes and the "Solicita tu demo" card', () => {
  it('is hidden in Contacto and in the admin login', () => {
    expect(byName('contact').meta?.hideDemoCta).toBe(true)
    expect(byName('admin-login').meta?.hideDemoCta).toBe(true)
  })

  it('is shown in the other public views', () => {
    ['home', 'solutions', 'rates', 'clients'].forEach((name) => {
      expect(byName(name).meta?.hideDemoCta).toBeFalsy()
    })
  })
})
