import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import NewAdminForm from '@/components/admin/NewAdminForm.vue'

function mountForm(props = {}) {
  return mount(NewAdminForm, {
    props: {
      form: reactive({ email: '', password: '', confirmPassword: '' }),
      errors: reactive({}),
      ...props,
    },
  })
}

describe('NewAdminForm (BGSI-197)', () => {
  it('emits submit when the form is sent', async () => {
    const wrapper = mountForm()

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('shows or hides both passwords with the checkbox', async () => {
    const wrapper = mountForm()
    const types = () => ['#admin-password', '#admin-confirm'].map((id) => wrapper.find(id).attributes('type'))

    expect(types()).toEqual(['password', 'password'])

    await wrapper.find('[data-test="show-passwords"]').setValue(true)

    expect(types()).toEqual(['text', 'text'])
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
