import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactStatusFilter from '@/components/admin/ContactStatusFilter.vue'

describe('ContactStatusFilter', () => {
  it('marks the selected status and emits the new one on click', async () => {
    const wrapper = mount(ContactStatusFilter, { props: { modelValue: null } })
    const buttons = wrapper.findAll('button')

    expect(buttons[0].attributes('aria-pressed')).toBe('true')

    await buttons[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['NEW'])
  })
})
