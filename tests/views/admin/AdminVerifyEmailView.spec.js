import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from '@/router/routes'
import AdminVerifyEmailView from '@/views/admin/AdminVerifyEmailView.vue'

async function mountAt(path, authService) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  const wrapper = mount(AdminVerifyEmailView, { props: { authService }, global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

// BGSI-240: /admin/verificar-email?token=... (the link sent to a new admin)
describe('AdminVerifyEmailView', () => {
  it('is a public page without the menu', () => {
    const route = routes.find((item) => item.name === 'admin-verify-email')

    expect(route.path).toBe('/admin/verificar-email')
    expect(route.meta).toEqual({ hideDemoCta: true, hideNav: true })
  })

  it('verifies the email and links to the login', async () => {
    const authService = { verifyEmail: vi.fn().mockResolvedValue() }

    const wrapper = await mountAt('/admin/verificar-email?token=abc', authService)

    expect(authService.verifyEmail).toHaveBeenCalledWith('abc')
    expect(wrapper.find('h1').text()).toBe('Cuenta verificada')
    expect(wrapper.find('a').attributes('href')).toBe('/admin/login')
  })

  it('without a token it does not call the backend', async () => {
    const authService = { verifyEmail: vi.fn() }

    const wrapper = await mountAt('/admin/verificar-email', authService)

    expect(authService.verifyEmail).not.toHaveBeenCalled()
    expect(wrapper.find('h1').text()).toBe('El enlace no es válido')
  })

  it('offers a new link when the old one was used or expired', async () => {
    const authService = {
      verifyEmail: vi.fn().mockRejectedValue({ status: 400 }),
      resendVerification: vi.fn().mockResolvedValue(),
    }
    const wrapper = await mountAt('/admin/verificar-email?token=old', authService)
    expect(wrapper.find('h1').text()).toBe('El enlace no es válido')

    await wrapper.find('[data-test="resend"]').trigger('click')
    await flushPromises()

    expect(authService.resendVerification).toHaveBeenCalledWith('old')
    expect(wrapper.text()).toContain('te hemos enviado un enlace nuevo')
    expect(wrapper.find('[data-test="resend"]').exists()).toBe(false)
  })

  it('says when the new link could not be asked', async () => {
    const authService = {
      verifyEmail: vi.fn().mockRejectedValue({ status: 400 }),
      resendVerification: vi.fn().mockRejectedValue({ status: 500 }),
    }
    const wrapper = await mountAt('/admin/verificar-email?token=old', authService)

    await wrapper.find('[data-test="resend"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('No se ha podido enviar')
  })

  it('shows other errors', async () => {
    const authService = { verifyEmail: vi.fn().mockRejectedValue({ status: 500, message: 'Error del servidor' }) }

    const wrapper = await mountAt('/admin/verificar-email?token=abc', authService)

    expect(wrapper.find('h1').text()).toBe('No se ha podido verificar')
    expect(wrapper.text()).toContain('Error del servidor')
  })
})
