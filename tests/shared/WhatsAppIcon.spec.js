import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatsAppIcon from '@/shared/WhatsAppIcon.vue'

describe('WhatsAppIcon (BGSI-242)', () => {
  it('is decorative and uses the size it receives', () => {
    const svg = mount(WhatsAppIcon, { props: { size: 30 } }).find('svg')

    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('width')).toBe('30')
  })

  it('gives each icon on the same page its own gradient', () => {
    const page = { components: { WhatsAppIcon }, template: '<div><WhatsAppIcon /><WhatsAppIcon /></div>' }
    const ids = mount(page).findAll('linearGradient').map((gradient) => gradient.attributes('id'))

    expect(ids[0]).not.toBe(ids[1])
  })
})
