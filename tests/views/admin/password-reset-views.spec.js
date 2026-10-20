import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from '@/router/routes'
import AdminForgotPasswordView from '@/views/admin/AdminForgotPasswordView.vue'
import AdminResetPasswordView from '@/views/admin/AdminResetPasswordView.vue'
import AdminLoginView from '@/views/admin/AdminLoginView.vue'

async function mountAt(path, component, props = {}) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  const wrapper = mount(component, { props, global: { plugins: [router, createPinia()] } })
  return { wrapper, router }
}

describe('Login: forgot password link (BGSI-273)', () => {
  it('links to the forgot password page', async () => {
    const { wrapper } = await mountAt('/admin/login', AdminLoginView)

    const link = wrapper.find('a.login-form__forgot')
    expect(link.text()).toBe('¿Olvidaste tu contraseña?')
    expect(link.attributes('href')).toBe('/admin/olvide-contrasena')
  })

  it('confirms the password change after the reset', async () => {
    const { wrapper } = await mountAt('/admin/login?reset=1', AdminLoginView)

    expect(wrapper.find('[role="status"]').text()).toContain('Contraseña cambiada')
  })
})

describe('AdminForgotPasswordView (BGSI-273)', () => {
  it('sends the email and shows the "check your email" message', async () => {
    const authService = { forgotPassword: vi.fn().mockResolvedValue() }
    const { wrapper } = await mountAt('/admin/olvide-contrasena', AdminForgotPasswordView, { authService })

    await wrapper.find('#forgot-email').setValue('admin@bg.com')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(authService.forgotPassword).toHaveBeenCalledWith('admin@bg.com')
    expect(wrapper.find('[role="status"]').text()).toContain('Revisa tu correo')
    expect(wrapper.text()).toContain('admin@bg.com')
  })

  it('explains what to do when nothing arrives and lets you try another email (BGSI-293)', async () => {
    const authService = { forgotPassword: vi.fn().mockResolvedValue() }
    const { wrapper } = await mountAt('/admin/olvide-contrasena', AdminForgotPasswordView, { authService })
    await wrapper.find('#forgot-email').setValue('luisa@hotmal.com')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.reset-sent__hint').text()).toContain('comprueba que es el email con el que entras al panel')

    await wrapper.find('[data-test="try-again"]').trigger('click')

    expect(wrapper.find('#forgot-email').element.value).toBe('luisa@hotmal.com')
    expect(wrapper.find('.reset-sent').exists()).toBe(false)
  })

  it('shows the email error', async () => {
    const { wrapper } = await mountAt('/admin/olvide-contrasena', AdminForgotPasswordView, { authService: { forgotPassword: vi.fn() } })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('.admin-form__error').text()).toBe('El email es obligatorio')
  })
})

describe('AdminResetPasswordView (BGSI-273)', () => {
  it('shows the invalid link message without a token', async () => {
    const { wrapper } = await mountAt('/admin/nueva-contrasena', AdminResetPasswordView, { authService: {} })

    expect(wrapper.find('[role="alert"]').text()).toContain('El enlace no es válido o ha caducado')
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('ticks the rules while typing', async () => {
    const { wrapper } = await mountAt('/admin/nueva-contrasena?token=tok', AdminResetPasswordView, { authService: {} })

    await wrapper.find('#reset-new').setValue('NewPass2026')

    expect(wrapper.findAll('.password-rules__item--ok')).toHaveLength(4)
    expect(wrapper.find('[data-rule="different"]').exists()).toBe(false)
  })

  it('saves the password and goes to the login with the notice', async () => {
    const authService = { resetPassword: vi.fn().mockResolvedValue() }
    const { wrapper, router } = await mountAt('/admin/nueva-contrasena?token=tok', AdminResetPasswordView, { authService })
    const push = vi.spyOn(router, 'push')

    await wrapper.find('#reset-new').setValue('NewPass2026')
    await wrapper.find('form').trigger('submit') // step 1 -> step 2 (BGSI-294)
    await wrapper.find('#reset-confirm').setValue('NewPass2026')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(authService.resetPassword).toHaveBeenCalledWith('tok', 'NewPass2026')
    expect(push).toHaveBeenCalledWith({ name: 'admin-login', query: { reset: '1' } })
  })

  it('shows the invalid link message when the backend rejects the token', async () => {
    const error = Object.assign(new Error('The link is not valid or has expired'), { status: 400, details: null })
    const authService = { resetPassword: vi.fn().mockRejectedValue(error) }
    const { wrapper } = await mountAt('/admin/nueva-contrasena?token=old', AdminResetPasswordView, { authService })

    await wrapper.find('#reset-new').setValue('NewPass2026')
    await wrapper.find('form').trigger('submit') // step 1 -> step 2 (BGSI-294)
    await wrapper.find('#reset-confirm').setValue('NewPass2026')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.reset-invalid').exists()).toBe(true)
  })
})
