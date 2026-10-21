import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AdminLoginForm from '@/components/admin/AdminLoginForm.vue'
import { routes } from '@/router/routes'

async function mountForm(authStore) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push('/admin/login')
  await router.isReady()
  const wrapper = mount(AdminLoginForm, { props: { authStore }, global: { plugins: [router] } })
  return { wrapper, router }
}

describe('AdminLoginForm', () => {
  it('shows validation errors when the form is empty', async () => {
    const { wrapper } = await mountForm({ login: vi.fn() })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('El email es obligatorio')
    expect(wrapper.text()).toContain('La contraseña es obligatoria')
  })

  it('goes to the dashboard after a successful login', async () => {
    const { wrapper, router } = await mountForm({ login: vi.fn().mockResolvedValue() })
    const push = vi.spyOn(router, 'push').mockResolvedValue()
    await wrapper.find('#login-email').setValue('admin@bg.es')
    await wrapper.find('#login-password').setValue('secret123')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(push).toHaveBeenCalledWith({ name: 'admin-dashboard' })
  })

  it('shows an alert when the credentials are wrong', async () => {
    const error = Object.assign(new Error('Unauthorized'), { status: 401 })
    const { wrapper } = await mountForm({ login: vi.fn().mockRejectedValue(error) })
    await wrapper.find('#login-email').setValue('admin@bg.es')
    await wrapper.find('#login-password').setValue('wrong-pass')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe('Email o contraseña incorrectos')
  })

  // BGSI-276
  it('asks for the code of the app and then enters', async () => {
    const authStore = {
      login: vi.fn().mockResolvedValue({ twoFactorRequired: true, pendingToken: 'pend' }),
      verifyTwoFactor: vi.fn().mockResolvedValue(),
    }
    const { wrapper, router } = await mountForm(authStore)
    const push = vi.spyOn(router, 'push').mockResolvedValue()
    await wrapper.find('#login-email').setValue('admin@bg.es')
    await wrapper.find('#login-password').setValue('secret123')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[data-test="code-step"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Verificación en dos pasos')
    expect(push).not.toHaveBeenCalled()

    await wrapper.find('#login-code').setValue('123456')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(authStore.verifyTwoFactor).toHaveBeenCalledWith('pend', '123456')
    expect(push).toHaveBeenCalledWith({ name: 'admin-dashboard' })
  })

  it('changes to a recovery code and goes back to the password', async () => {
    const authStore = { login: vi.fn().mockResolvedValue({ twoFactorRequired: true, pendingToken: 'pend' }) }
    const { wrapper } = await mountForm(authStore)
    await wrapper.find('#login-email').setValue('admin@bg.es')
    await wrapper.find('#login-password').setValue('secret123')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await wrapper.find('[data-test="toggle-recovery"]').trigger('click')
    expect(wrapper.find('label[for="login-code"]').text()).toBe('Código de recuperación')

    await wrapper.find('[data-test="back-to-password"]').trigger('click')
    expect(wrapper.find('#login-password').exists()).toBe(true)
  })
})
