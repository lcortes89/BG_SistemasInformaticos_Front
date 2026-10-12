import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RateOptionCard from '@/components/rates/RateOptionCard.vue'

const option = { code: 'RESTAURANT', icon: '🍽️', label: 'Restaurante', description: 'Comedor con servicio de mesa.' }

describe('RateOptionCard', () => {
  it('shows the option and emits its code when clicked', async () => {
    const wrapper = mount(RateOptionCard, { props: { option } })

    await wrapper.trigger('click')

    expect(wrapper.text()).toContain('Restaurante')
    expect(wrapper.emitted('select')[0]).toEqual(['RESTAURANT'])
  })

  it('marks the selected option for screen readers', () => {
    const wrapper = mount(RateOptionCard, { props: { option, selected: true } })

    expect(wrapper.attributes('aria-checked')).toBe('true')
    expect(wrapper.classes()).toContain('is-selected')
  })
})
