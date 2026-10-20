import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordInput from '@/shared/PasswordInput.vue'

// BGSI-267: password field with an eye button
describe('PasswordInput', () => {
  const mountInput = (props = {}, attrs = {}) =>
    mount(PasswordInput, { props: { modelValue: 'secret', ...props }, attrs })

  it('hides the password at the start', () => {
    const wrapper = mountInput()

    expect(wrapper.find('input').attributes('type')).toBe('password')
    expect(wrapper.find('button').attributes('aria-label')).toBe('Mostrar contraseña')
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('false')
  })

  it('shows and hides the password with the eye button', async () => {
    const wrapper = mountInput()
    const button = wrapper.find('button')

    await button.trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
    expect(button.attributes('aria-label')).toBe('Ocultar contraseña')
    expect(button.attributes('aria-pressed')).toBe('true')

    await button.trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('works with v-model', async () => {
    const wrapper = mountInput({ 'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }) })

    expect(wrapper.find('input').element.value).toBe('secret')
    await wrapper.find('input').setValue('new-secret')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['new-secret'])
  })

  it('passes id, autocomplete and aria attributes to the input, not to the wrapper', () => {
    const wrapper = mountInput({}, { id: 'login-password', autocomplete: 'current-password', 'aria-invalid': 'true' })
    const input = wrapper.find('input')

    expect(input.attributes('id')).toBe('login-password')
    expect(input.attributes('autocomplete')).toBe('current-password')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.attributes('id')).toBeUndefined()
  })

  it('the eye button does not submit the form', () => {
    expect(mountInput().find('button').attributes('type')).toBe('button')
  })
})
