import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { routes } from '@/router/routes'
import { useAuthStore } from '@/stores/auth'
import SessionModel from '@/core/models/auth/SessionModel'
import { IDLE_TIMEOUT_MS, IDLE_WARNING_MS } from '@/core/config/session'
import AdminLayout from '@/views/admin/AdminLayout.vue'

// BGSI-268: the admin panel closes the session after 15 minutes without activity
async function mountLayout() {
  setActivePinia(createPinia())
  useAuthStore().session = new SessionModel('token', 'luisa@bg.es', 'ADMIN')
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push('/admin/mi-cuenta')
  await router.isReady()
  const push = vi.spyOn(router, 'push').mockResolvedValue()
  const wrapper = mount(AdminLayout, { global: { plugins: [router], stubs: { RouterView: true } } })
  await flushPromises()
  return { wrapper, push }
}

describe('AdminLayout: logout for inactivity (BGSI-268)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('warns 30 seconds before and then closes the session with the reason', async () => {
    const { wrapper, push } = await mountLayout()

    vi.advanceTimersByTime(IDLE_TIMEOUT_MS - IDLE_WARNING_MS + 1_000)
    await flushPromises()
    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(true)

    vi.advanceTimersByTime(IDLE_WARNING_MS)
    await flushPromises()

    expect(useAuthStore().session).toBeNull()
    expect(localStorage.getItem('bgsi-logout-reason')).toBe('idle')
    expect(push).toHaveBeenCalledWith({ name: 'admin-login', query: { reason: 'idle' } })
    wrapper.unmount()
  })

  it('"Seguir conectada" keeps the session open', async () => {
    const { wrapper, push } = await mountLayout()
    vi.advanceTimersByTime(IDLE_TIMEOUT_MS - 10_000)
    await flushPromises()

    await wrapper.find('.idle-warning__stay').trigger('click')
    vi.advanceTimersByTime(20_000)
    await flushPromises()

    expect(wrapper.find('[role="alertdialog"]').exists()).toBe(false)
    expect(push).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('"Cerrar sesión ahora" logs out at once', async () => {
    const { wrapper, push } = await mountLayout()
    vi.advanceTimersByTime(IDLE_TIMEOUT_MS - 10_000)
    await flushPromises()

    await wrapper.find('.idle-warning__logout').trigger('click')

    expect(useAuthStore().session).toBeNull()
    expect(push).toHaveBeenCalledWith({ name: 'admin-login' })
    wrapper.unmount()
  })
})
