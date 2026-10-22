import { describe, it, expect } from 'vitest'
import { routes } from '@/router/routes'

const adminChildren = routes.find((route) => route.path === '/admin').children
const byPath = (path) => adminChildren.find((route) => route.path === path)

// BGSI-261, split in two pages in BGSI-297
describe('Foto de portada and Avisos por correo routes', () => {
  it('each part of the old "Ajustes" has its own address', () => {
    expect(adminChildren.find((route) => route.name === 'admin-settings').path).toBe('foto-portada')
    expect(adminChildren.find((route) => route.name === 'admin-mail-settings').path).toBe('avisos-correo')
  })

  it('the old /admin/ajustes and /admin/apariencia addresses still work', () => {
    expect(byPath('ajustes').redirect).toEqual({ name: 'admin-settings' })
    expect(byPath('apariencia').redirect).toEqual({ name: 'admin-settings' })
  })
})
