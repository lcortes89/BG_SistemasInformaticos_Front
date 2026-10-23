import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdminChangeEmailView from '@/views/admin/AdminChangeEmailView.vue'
import AdminTwoFactorView from '@/views/admin/AdminTwoFactorView.vue'
import { useAuthStore } from '@/stores/auth'
import SessionModel from '@/core/models/auth/SessionModel'

// BGSI-314: "Ajustes de perfil > Cambiar email" and "> Verificación en dos pasos", each one on its own page
describe('profile settings pages', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    useAuthStore().session = new SessionModel('token', 'luisa@bg.es', 'ADMIN')
  })

  it('Cambiar email: shows the current email, the card of BGSI-301 and its tips', async () => {
    const accountService = { getPendingEmailChange: vi.fn().mockResolvedValue(null) }
    const wrapper = mount(AdminChangeEmailView, { props: { accountService } })
    await flushPromises()

    expect(wrapper.find('h1').text()).toBe('Cambiar email')
    expect(wrapper.find('header').text()).toContain('luisa@bg.es')
    expect(wrapper.find('#change-email-new').exists()).toBe(true)
    expect(wrapper.find('aside').text()).toContain('El enlace vale 1 hora')
    expect(accountService.getPendingEmailChange).toHaveBeenCalled()
  })

  it('Verificación en dos pasos: shows the card of BGSI-276 and its tips', async () => {
    const accountService = { getTwoFactor: vi.fn().mockResolvedValue({ enabled: true, recoveryCodesLeft: 8 }) }
    const wrapper = mount(AdminTwoFactorView, { props: { accountService } })
    await flushPromises()

    expect(wrapper.find('h1').text()).toBe('Verificación en dos pasos')
    expect(wrapper.text()).toContain('Activada')
    expect(wrapper.find('aside').text()).toContain('Guarda los códigos de recuperación')
  })
})
