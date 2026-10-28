import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectorSummary from '@/components/home/SectorSummary.vue'

describe('SectorSummary', () => {
  it('shows the value proposition from the prototype', () => {
    const wrapper = mount(SectorSummary)

    expect(wrapper.text()).toContain('Propuesta de valor')
    expect(wrapper.find('h2').text()).toBe('Resumen que ofrecemos al sector')
    expect(wrapper.text()).toContain('Automatizamos cobros')
  })

  it('no longer shows the old three columns', () => {
    const wrapper = mount(SectorSummary)

    expect(wrapper.text()).not.toContain('Lo que ofrecemos al sector')
    expect(wrapper.findAll('h3')).toHaveLength(0)
  })
})
