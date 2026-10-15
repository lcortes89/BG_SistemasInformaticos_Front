import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkeletonCard from '@/shared/SkeletonCard.vue'

describe('SkeletonCard (BGSI-243)', () => {
  it('draws a brand card by default and is hidden from screen readers', () => {
    const wrapper = mount(SkeletonCard)

    expect(wrapper.classes()).toContain('skeleton--brand')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.skeleton__badge').exists()).toBe(true)
  })

  it('draws a product sheet with an image block', () => {
    const wrapper = mount(SkeletonCard, { props: { variant: 'product' } })

    expect(wrapper.find('.skeleton__media').exists()).toBe(true)
  })

  it('draws a client with a round logo and a name line', () => {
    const wrapper = mount(SkeletonCard, { props: { variant: 'client' } })

    expect(wrapper.find('.skeleton__logo').exists()).toBe(true)
    expect(wrapper.findAll('.skeleton__line')).toHaveLength(1)
  })
})
