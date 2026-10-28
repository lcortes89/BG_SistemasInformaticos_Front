import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import AdminLoginView from '@/views/admin/AdminLoginView.vue'
import { routes } from '@/router/routes'

async function mountAt(path) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  return mount(AdminLoginView, { global: { plugins: [router, createPinia()] } })
}

describe('AdminLoginView', () => {
  it('explains that the session expired', async () => {
    const wrapper = await mountAt('/admin/login?expired=1')

    expect(wrapper.find('[role="status"]').text()).toContain('Tu sesión ha caducado')
  })

  it('does not show the notice on a normal visit', async () => {
    const wrapper = await mountAt('/admin/login')

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })
})

describe('AdminLoginView: logout from another tab (BGSI-257)', () => {
  it('explains that the session was closed in another tab', async () => {
    const wrapper = await mountAt('/admin/login?loggedOut=1')

    expect(wrapper.find('[role="status"]').text()).toContain('Se ha cerrado la sesión desde otra pestaña')
  })
})

describe('AdminLoginView: closed for inactivity (BGSI-268)', () => {
  it('explains that the session was closed for inactivity', async () => {
    const wrapper = await mountAt('/admin/login?reason=idle')

    expect(wrapper.find('[role="status"]').text()).toBe('Tu sesión se ha cerrado por inactividad. Vuelve a iniciar sesión.')
  })
})
