import { describe, it, expect } from 'vitest'
import { ADMIN_HOME, ADMIN_MENU, groupOf } from '@/core/config/admin-menu'
import { routes } from '@/router/routes'

const adminPages = routes.find((route) => route.path === '/admin').children.filter((route) => route.component)

// BGSI-297
describe('admin menu', () => {
  it('has the groups in the agreed order', () => {
    expect(ADMIN_MENU.map((group) => group.title))
      .toEqual(['Gestión de clientes', 'Gestión comercial', 'Gestión Administración', 'Ajustes de perfil'])
  })

  it('every page of the panel is in the menu once', () => {
    const inMenu = [ADMIN_HOME, ...ADMIN_MENU.flatMap((group) => group.links)].map((link) => link.to.name)

    expect(inMenu.sort()).toEqual(adminPages.map((route) => route.name).sort())
  })

  it('finds the group of a page', () => {
    expect(groupOf('admin-contacts')).toBe('Gestión de clientes')
    expect(groupOf('admin-rates')).toBe('Gestión comercial')
    expect(groupOf('admin-mail-settings')).toBe('Gestión Administración')
    expect(groupOf('admin-account')).toBe('Ajustes de perfil')
    expect(groupOf('admin-dashboard')).toBeNull()
  })
})
