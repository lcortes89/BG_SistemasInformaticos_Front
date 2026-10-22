import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from '@/router/routes'
import AdminConfirmEmailView from '@/views/admin/AdminConfirmEmailView.vue'
import { useAuthStore } from '@/stores/auth'
import SessionModel from '@/core/models/auth/SessionModel'

async function mountAt(path, authService) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  const wrapper = mount(AdminConfirmEmailView, { props: { authService }, global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

// BGSI-301: /admin/confirmar-email?token=...
describe('AdminConfirmEmailView', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    useAuthStore().session = new SessionModel('old-token', 'old@bg.es', 'ADMIN')
  })

  it('is a public page without the menu', () => {
    const route = routes.find((item) => item.name === 'admin-confirm-email')

    expect(route.path).toBe('/admin/confirmar-email')
    expect(route.meta).toEqual({ hideDemoCta: true, hideNav: true })
  })

  it('confirms the new email, logs out and links to the login', async () => {
    const authService = { confirmEmailChange: vi.fn().mockResolvedValue('new@bg.es') }

    const wrapper = await mountAt('/admin/confirmar-email?token=abc', authService)

    expect(authService.confirmEmailChange).toHaveBeenCalledWith('abc')
    expect(wrapper.find('h1').text()).toBe('Email cambiado')
    expect(wrapper.find('[data-test="new-email"]').text()).toBe('new@bg.es')
    expect(wrapper.find('a').attributes('href')).toBe('/admin/login')
    expect(useAuthStore().isAuthenticated).toBe(false)
  })

  it('explains that the link is not valid', async () => {
    const authService = { confirmEmailChange: vi.fn().mockRejectedValue({ status: 400 }) }

    const wrapper = await mountAt('/admin/confirmar-email?token=old', authService)

    expect(wrapper.find('h1').text()).toBe('El enlace no es válido')
    expect(wrapper.text()).toContain('Tu email no ha cambiado')
    expect(useAuthStore().email).toBe('old@bg.es') // the session is kept
  })

  it('without a token it does not call the backend', async () => {
    const authService = { confirmEmailChange: vi.fn() }

    const wrapper = await mountAt('/admin/confirmar-email', authService)

    expect(authService.confirmEmailChange).not.toHaveBeenCalled()
    expect(wrapper.find('h1').text()).toBe('El enlace no es válido')
  })

  it('says when another admin already uses the email', async () => {
    const authService = { confirmEmailChange: vi.fn().mockRejectedValue({ status: 409 }) }

    const wrapper = await mountAt('/admin/confirmar-email?token=abc', authService)

    expect(wrapper.text()).toContain('Ese email ya lo usa otro administrador')
  })

  it('shows other errors', async () => {
    const authService = { confirmEmailChange: vi.fn().mockRejectedValue({ status: 500, message: 'Error del servidor' }) }

    const wrapper = await mountAt('/admin/confirmar-email?token=abc', authService)

    expect(wrapper.find('h1').text()).toBe('No se ha podido cambiar')
    expect(wrapper.text()).toContain('Error del servidor')
  })
})
