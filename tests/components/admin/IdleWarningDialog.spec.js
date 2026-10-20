import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IdleWarningDialog from '@/components/admin/IdleWarningDialog.vue'

// BGSI-268: "¿Sigues ahí?"
describe('IdleWarningDialog', () => {
  it('is an accessible alert dialog with the countdown and the focus on "Seguir conectada"', () => {
    const wrapper = mount(IdleWarningDialog, { props: { secondsLeft: 22 }, attachTo: document.body })

    const box = wrapper.find('[role="alertdialog"]')
    expect(box.attributes('aria-modal')).toBe('true')
    expect(wrapper.find('#idle-warning-text').text()).toBe('Tu sesión se cerrará en 22 s por inactividad.')
    expect(document.activeElement.textContent.trim()).toBe('Seguir conectada')
    expect(wrapper.find('.idle-warning__bar span').attributes('style')).toContain('width:')
    wrapper.unmount()
  })

  it('announces the time to screen readers only at some seconds', async () => {
    const wrapper = mount(IdleWarningDialog, { props: { secondsLeft: 22 } })
    expect(wrapper.find('[aria-live="polite"]').text()).toBe('')

    await wrapper.setProps({ secondsLeft: 10 })

    expect(wrapper.find('[aria-live="polite"]').text()).toBe('Quedan 10 segundos')
  })

  it('emits stay and logout', async () => {
    const wrapper = mount(IdleWarningDialog, { props: { secondsLeft: 5 } })

    await wrapper.find('.idle-warning__stay').trigger('click')
    await wrapper.find('.idle-warning__logout').trigger('click')

    expect(wrapper.emitted('stay')).toHaveLength(1)
    expect(wrapper.emitted('logout')).toHaveLength(1)
  })
})
