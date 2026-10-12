import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandCard from '@/components/solutions/BrandCard.vue'
import BrandModel from '@/core/models/brand/BrandModel'

const brand = new BrandModel(1, 'BDP', 'Software TPV', 'Software para hostelería', null)

describe('BrandCard', () => {
  it('shows the brand name, category and description', () => {
    const wrapper = mount(BrandCard, { props: { brand } })

    expect(wrapper.text()).toContain('BDP')
    expect(wrapper.text()).toContain('Software para hostelería')
    expect(wrapper.text()).toContain('Software TPV')
  })

  it('emits "select" with the brand when the button is clicked', async () => {
    const wrapper = mount(BrandCard, { props: { brand } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('select')[0]).toEqual([brand])
  })

  it('is highlighted when it is the active brand', () => {
    const wrapper = mount(BrandCard, { props: { brand, active: true } })

    expect(wrapper.classes()).toContain('brand-card--active')
  })
})
