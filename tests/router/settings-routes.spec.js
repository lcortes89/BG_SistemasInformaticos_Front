import { describe, it, expect } from 'vitest'
import { routes } from '@/router/routes'

const adminChildren = routes.find((route) => route.path === '/admin').children

describe('Ajustes route (BGSI-261)', () => {
  it('lives in /admin/ajustes', () => {
    expect(adminChildren.find((route) => route.name === 'admin-settings').path).toBe('ajustes')
  })

  it('the old /admin/apariencia address takes you to Ajustes', () => {
    expect(adminChildren.find((route) => route.path === 'apariencia').redirect).toEqual({ name: 'admin-settings' })
  })
})
