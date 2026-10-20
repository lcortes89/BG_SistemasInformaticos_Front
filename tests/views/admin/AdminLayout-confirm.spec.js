import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { routes } from '@/router/routes'
import { useAuthStore } from '@/stores/auth'
import { useConfirmationStore } from '@/stores/confirmation'
import SessionModel from '@/core/models/auth/SessionModel'
import AdminLayout from '@/views/admin/AdminLayout.vue'

// BGSI-275: the panel shows "Confirma tu contraseña" when a sensitive action needs it
async function mountLayout() {
  setActivePinia(createPinia())
  useAuthStore().session = new SessionModel('token', 'luisa@bg.es', 'ADMIN')
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push('/admin/mi-cuenta')
  await router.isReady()
  vi.spyOn(router, 'push').mockResolvedValue()
  const wrapper = mount(AdminLayout, { global: { plugins: [router], stubs: { RouterView: true } } })
  await flushPromises()
  return wrapper
}

describe('AdminLayout: password confirmation (BGSI-275)', () => {
  afterEach(() => vi.restoreAllMocks())

  it('opens the dialog on request and keeps the token for the logged-in admin', async () => {
    const wrapper = await mountLayout()
    const confirmation = useConfirmationStore()
    expect(wrapper.find('.confirm-password').exists()).toBe(false)

    const waiting = confirmation.request()
    await flushPromises()
    expect(wrapper.find('.confirm-password').exists()).toBe(true)

    wrapper.findComponent({ name: 'ConfirmPasswordDialog' }).vm.$emit('confirmed', { token: 'tok', expiresInSeconds: 300 })
    await flushPromises()

    await expect(waiting).resolves.toBe('tok')
    expect(confirmation.validToken('luisa@bg.es')).toBe('tok')
    expect(wrapper.find('.confirm-password').exists()).toBe(false)
    wrapper.unmount()
  })

  it('forgets the token when logging out', async () => {
    const wrapper = await mountLayout()
    const confirmation = useConfirmationStore()
    confirmation.confirmed('tok', 300, 'luisa@bg.es')

    await wrapper.find('.admin-layout__logout').trigger('click')

    expect(confirmation.validToken('luisa@bg.es')).toBeNull()
    wrapper.unmount()
  })
})
