import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import NewAdminForm from '@/components/admin/NewAdminForm.vue'

function mountForm(props = {}) {
  return mount(NewAdminForm, {
    props: {
      form: reactive({ email: '', password: '', confirmEmail: '', confirmPassword: '' }),
      errors: reactive({}),
      ...props,
    },
  })
}

describe('NewAdminForm (BGSI-197, two steps BGSI-294)', () => {
  it('step 1 asks for the email and the password and emits continue', async () => {
    const wrapper = mountForm()

    expect(wrapper.find('#admin-email').exists()).toBe(true)
    expect(wrapper.find('#admin-password').attributes('type')).toBe('password')
    expect(wrapper.find('#admin-confirm-email').exists()).toBe(false)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('continue')).toHaveLength(1)
  })

  it('step 2 asks to repeat both and emits submit', async () => {
    const wrapper = mountForm({ step: 2 })

    expect(wrapper.find('#admin-email').exists()).toBe(false)
    expect(wrapper.find('#admin-confirm-email').exists()).toBe(true)
    expect(wrapper.find('#admin-confirm').exists()).toBe(true)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('does not let you paste or drop the repeated email', async () => {
    const wrapper = mountForm({ step: 2 })
    const input = wrapper.find('#admin-confirm-email').element
    const paste = new Event('paste', { cancelable: true })
    const drop = new Event('drop', { cancelable: true })

    input.dispatchEvent(paste)
    input.dispatchEvent(drop)

    expect(paste.defaultPrevented).toBe(true)
    expect(drop.defaultPrevented).toBe(true)
    expect(wrapper.emitted('blocked-paste')).toHaveLength(2)

    await wrapper.setProps({ pasteBlocked: true })
    expect(wrapper.text()).toContain('no admite pegar')
  })

  it('shows the field errors and the server error', () => {
    const wrapper = mountForm({
      errors: reactive({ email: 'El email es obligatorio' }),
      submitError: 'Ya existe un administrador con ese email',
    })

    expect(wrapper.text()).toContain('El email es obligatorio')
    expect(wrapper.find('[role="alert"]').text()).toBe('Ya existe un administrador con ese email')
  })
})
