import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InviteAdminForm from '@/components/admin/InviteAdminForm.vue'

const mountForm = (props = {}) => mount(InviteAdminForm, {
  props: { form: { email: '', confirmEmail: '' }, errors: {}, ...props },
})

// BGSI-277: presentational, the state is in useInviteAdminForm
describe('InviteAdminForm', () => {
  it('step 1 asks for the email and "Continuar" goes on', async () => {
    const wrapper = mountForm()

    expect(wrapper.find('#invite-email').exists()).toBe(true)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('continue')).toHaveLength(1)
  })

  it('step 2 asks to repeat the email and sends the invitation', async () => {
    const wrapper = mountForm({ step: 2 })

    expect(wrapper.find('#invite-email').exists()).toBe(false)
    expect(wrapper.find('#invite-confirm-email').exists()).toBe(true)
    expect(wrapper.find('.admin-form__submit').text()).toBe('Enviar invitación')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('blocks pasting the repeated email', async () => {
    const wrapper = mountForm({ step: 2 })

    await wrapper.find('#invite-confirm-email').trigger('paste')

    expect(wrapper.emitted('blocked-paste')).toHaveLength(1)
  })

  it('shows the errors, the server error and the sending state', () => {
    const wrapper = mountForm({ errors: { email: 'El email es obligatorio' }, submitError: 'Ya existe un administrador con ese email' })

    expect(wrapper.find('.admin-form__error').text()).toBe('El email es obligatorio')
    expect(wrapper.find('[role="alert"]').text()).toBe('Ya existe un administrador con ese email')
    expect(mountForm({ step: 2, isSubmitting: true }).find('.admin-form__submit').text()).toBe('Enviando...')
  })

  it('"Cancelar" closes the window', async () => {
    const wrapper = mountForm()

    await wrapper.find('.invite-admin__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
