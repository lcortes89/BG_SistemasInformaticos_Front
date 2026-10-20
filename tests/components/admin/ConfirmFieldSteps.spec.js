import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmFieldSteps from '@/components/admin/ConfirmFieldSteps.vue'

// BGSI-294: layout of the forms in two steps
function mountSteps(props = {}) {
  return mount(ConfirmFieldSteps, {
    attachTo: document.body,
    props: { step: 1, doneLabel: 'Email introducido', secondHint: 'Repite el email.', ...props },
    slots: {
      first: '<input id="first" />',
      second: '<input id="second" />',
      submit: '<button type="submit" id="save">Guardar</button>',
    },
  })
}

describe('ConfirmFieldSteps', () => {
  it('shows step 1 with the continue button and the progress', () => {
    const wrapper = mountSteps()

    expect(wrapper.find('#first').exists()).toBe(true)
    expect(wrapper.find('#second').exists()).toBe(false)
    expect(wrapper.find('[data-test="continue"]').text()).toBe('Continuar →')
    expect(wrapper.find('[role="progressbar"]').attributes('aria-valuenow')).toBe('1')
    wrapper.unmount()
  })

  it('hides the first field in step 2, shows the summary and focuses the new field', async () => {
    const wrapper = mountSteps()

    await wrapper.setProps({ step: 2 })
    await new Promise((resolve) => setTimeout(resolve))

    expect(wrapper.find('#first').exists()).toBe(false)
    expect(wrapper.text()).toContain('✓ Email introducido')
    expect(wrapper.find('[aria-live="polite"]').text()).toBe('Paso 2 de 2. Repite el email.')
    expect(document.activeElement.id).toBe('second')
    expect(wrapper.find('#save').exists()).toBe(true)
    wrapper.unmount()
  })

  it('emits back with "Cambiar" and with "Atrás"', async () => {
    const wrapper = mountSteps({ step: 2 })

    await wrapper.find('[data-test="change"]').trigger('click')
    await wrapper.find('[data-test="back"]').trigger('click')

    expect(wrapper.emitted('back')).toHaveLength(2)
    wrapper.unmount()
  })

  it('shows the paste notice and can hide the progress', () => {
    const wrapper = mountSteps({ step: 2, pasteBlocked: true, showProgress: false })

    expect(wrapper.find('[role="alert"]').text()).toContain('no admite pegar')
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('uses its own continue label and can disable it', () => {
    const wrapper = mountSteps({ continueLabel: 'Guardar avisos', continueDisabled: true })

    const button = wrapper.find('[data-test="continue"]')
    expect(button.text()).toBe('Guardar avisos')
    expect(button.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })
})
