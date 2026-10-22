import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { routes } from '@/router/routes'
import { http } from '@/core/apis/base/BaseRepository'
import AdminLayout from '@/views/admin/AdminLayout.vue'

async function mountAt(path) {
  setActivePinia(createPinia())
  vi.spyOn(http, 'get').mockResolvedValue({ data: {} })
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  // RouterView stubbed: only the menu is tested here
  const wrapper = mount(AdminLayout, { global: { plugins: [router], stubs: { RouterView: true } }, attachTo: document.body })
  await flushPromises()
  return { wrapper, router }
}

const group = (wrapper, title) => wrapper.findAll('.admin-layout__group').find((g) => g.text().includes(title))
const isOpen = (wrapper, title) => group(wrapper, title).find('button').attributes('aria-expanded') === 'true'

// BGSI-297: menu by groups. BGSI-298: ☰ button on mobile
describe('AdminLayout menu', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('on the Resumen all the groups are closed and Resumen is marked', async () => {
    const { wrapper } = await mountAt('/admin')

    expect(wrapper.findAll('.admin-layout__group button[aria-expanded="true"]')).toHaveLength(0)
    expect(wrapper.find('.admin-layout__home').classes()).toContain('admin-layout__home--active')
  })

  it('the group of the page you are on is open and the page is marked', async () => {
    const { wrapper } = await mountAt('/admin/avisos-correo')

    expect(isOpen(wrapper, 'Gestión Administración')).toBe(true)
    expect(wrapper.find('.admin-layout__link--active').text()).toBe('Avisos por correo')
  })

  it('opening a group closes the other one (only one at a time)', async () => {
    const { wrapper } = await mountAt('/admin/marcas')
    expect(isOpen(wrapper, 'Gestión comercial')).toBe(true)

    await group(wrapper, 'Gestión de clientes').find('button').trigger('click')

    expect(isOpen(wrapper, 'Gestión de clientes')).toBe(true)
    expect(isOpen(wrapper, 'Gestión comercial')).toBe(false)
    expect(group(wrapper, 'Gestión de clientes').findAll('a').map((a) => a.text())).toEqual(['Contactos', 'Clientes'])
  })

  it('clicking an open group closes it', async () => {
    const { wrapper } = await mountAt('/admin/marcas')

    await group(wrapper, 'Gestión comercial').find('button').trigger('click')

    expect(isOpen(wrapper, 'Gestión comercial')).toBe(false)
  })

  it('the ☰ button opens the menu, becomes "Cerrar menú" and a new page closes it', async () => {
    const { wrapper, router } = await mountAt('/admin')
    const toggle = wrapper.find('[data-test="admin-menu-toggle"]')
    expect(toggle.attributes('aria-label')).toBe('Abrir menú')

    await toggle.trigger('click')
    expect(wrapper.find('#admin-nav').classes()).toContain('admin-layout__nav--open')
    expect(toggle.attributes('aria-label')).toBe('Cerrar menú')

    await router.push('/admin/marcas')
    await flushPromises()
    expect(wrapper.find('#admin-nav').classes()).not.toContain('admin-layout__nav--open')
  })

  it('the menu has the session too (shown on mobile)', async () => {
    const { wrapper } = await mountAt('/admin')

    expect(wrapper.find('#admin-nav .admin-layout__session').text()).toContain('Cerrar sesión')
  })
})
