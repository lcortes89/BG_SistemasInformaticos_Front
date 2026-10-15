import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandStickyBar from '@/components/solutions/BrandStickyBar.vue'

const brands = [{ id: 1, name: 'BDP' }, { id: 2, name: 'AHORA One' }]

describe('BrandStickyBar (BGSI-247)', () => {
  it('shows every brand and marks the chosen one', () => {
    const wrapper = mount(BrandStickyBar, { props: { brands, selectedId: 2, visible: true } })
    const chips = wrapper.findAll('.brand-bar__chip')

    expect(chips.map((chip) => chip.text())).toEqual(['BDP', 'AHORA One'])
    expect(chips[1].attributes('aria-pressed')).toBe('true')
    expect(wrapper.classes()).toContain('is-visible')
  })

  it('tells the page which brand was chosen and when to show all brands', async () => {
    const wrapper = mount(BrandStickyBar, { props: { brands, selectedId: 2, visible: true } })

    await wrapper.findAll('.brand-bar__chip')[0].trigger('click')
    await wrapper.find('.brand-bar__all').trigger('click')

    expect(wrapper.emitted('select')[0][0]).toEqual(brands[0])
    expect(wrapper.emitted('show-all')).toHaveLength(1)
  })

  it('stays hidden and out of the keyboard order until the brand cards are passed', () => {
    const wrapper = mount(BrandStickyBar, { props: { brands, selectedId: 1, visible: false } })

    expect(wrapper.classes()).not.toContain('is-visible')
    expect(wrapper.find('.brand-bar__chip').attributes('tabindex')).toBe('-1')
  })
})
