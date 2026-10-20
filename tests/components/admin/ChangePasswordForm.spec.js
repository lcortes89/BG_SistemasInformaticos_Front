import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import ChangePasswordForm from '@/components/admin/ChangePasswordForm.vue'
import { passwordRules } from '@/composables/admin/useChangePasswordForm'

// BGSI-272: the form only shows data; the logic is in useChangePasswordForm
function mountForm(props = {}) {
  const form = reactive({ currentPassword: '', newPassword: 'Ribadeo2', confirmPassword: '' })
  return mount(ChangePasswordForm, {
    props: { form, errors: {}, rules: passwordRules('Ribadeo2', ''), ...props },
  })
}

describe('ChangePasswordForm', () => {
  it('has the three password fields with the eye button', () => {
    const wrapper = mountForm()

    expect(wrapper.find('#account-current').attributes('type')).toBe('password')
    expect(wrapper.find('#account-new').exists()).toBe(true)
    expect(wrapper.find('#account-confirm').exists()).toBe(true)
    expect(wrapper.findAll('.password-input__toggle')).toHaveLength(3)
  })

  it('shows which rules are already met', () => {
    const wrapper = mountForm()

    expect(wrapper.find('[data-rule="length"]').classes()).not.toContain('password-rules__item--ok')
    expect(wrapper.find('[data-rule="upper"]').classes()).toContain('password-rules__item--ok')
    expect(wrapper.find('[data-rule="number"]').text()).toContain('(cumplido)')
  })

  it('shows the field errors and the general error', () => {
    const wrapper = mountForm({
      errors: { currentPassword: 'La contraseña actual no es correcta' },
      submitError: 'Ha ocurrido un error en el servidor.',
    })

    expect(wrapper.find('#account-current-error').text()).toBe('La contraseña actual no es correcta')
    expect(wrapper.find('#account-current').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('[role="alert"]').text()).toBe('Ha ocurrido un error en el servidor.')
  })

  it('emits submit and disables the button while saving', async () => {
    const wrapper = mountForm()
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toHaveLength(1)

    await wrapper.setProps({ isSubmitting: true })
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button[type="submit"]').text()).toBe('Guardando...')
  })
})
