import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ConfirmPasswordDialog from '@/components/admin/ConfirmPasswordDialog.vue'

// BGSI-275: dialog asked before a sensitive action
describe('ConfirmPasswordDialog', () => {
  it('is an accessible dialog with the focus on the password', () => {
    const wrapper = mount(ConfirmPasswordDialog, { props: { service: { confirmPassword: vi.fn() } }, attachTo: document.body })

    expect(wrapper.find('[role="dialog"]').attributes('aria-modal')).toBe('true')
    expect(wrapper.find('h2').text()).toBe('Confirma tu contraseña')
    expect(document.activeElement.id).toBe('confirm-password-input')
    wrapper.unmount()
  })

  it('emits confirmed with the token when the password is right', async () => {
    const service = { confirmPassword: vi.fn().mockResolvedValue({ token: 'tok', expiresInSeconds: 300 }) }
    const wrapper = mount(ConfirmPasswordDialog, { props: { service } })

    await wrapper.find('#confirm-password-input').setValue('Correct2026')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.emitted('confirmed')[0]).toEqual([{ token: 'tok', expiresInSeconds: 300 }])
  })

  it('shows the error and does not close with a wrong password', async () => {
    const service = { confirmPassword: vi.fn().mockRejectedValue(Object.assign(new Error('x'), { status: 400 })) }
    const wrapper = mount(ConfirmPasswordDialog, { props: { service } })

    await wrapper.find('#confirm-password-input').setValue('Wrong2026')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('.confirm-password__error').text()).toBe('Contraseña incorrecta')
    expect(wrapper.find('#confirm-password-input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.emitted('confirmed')).toBeUndefined()
  })

  it('emits cancel with the button and with Escape', async () => {
    const wrapper = mount(ConfirmPasswordDialog, { props: { service: { confirmPassword: vi.fn() } } })

    await wrapper.find('.confirm-password__cancel').trigger('click')
    await wrapper.find('.confirm-password').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('cancel')).toHaveLength(2)
  })
})
