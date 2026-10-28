import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SocialIcon from '@/shared/SocialIcon.vue'

// BGSI-320: logos of the social networks
describe('SocialIcon', () => {
  it.each(['facebook', 'instagram', 'linkedin'])('draws %s, hidden from screen readers', (name) => {
    const svg = mount(SocialIcon, { props: { name } }).find('svg')

    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.findAll('path').length).toBeGreaterThan(0)
  })

  it('takes the size and the colour of the link', () => {
    const svg = mount(SocialIcon, { props: { name: 'facebook', size: 28 } }).find('svg')

    expect(svg.attributes('width')).toBe('28')
    expect(svg.attributes('fill')).toBe('currentColor')
  })

  it('an unknown name draws nothing', () => {
    expect(mount(SocialIcon, { props: { name: 'tiktok' } }).find('path').exists()).toBe(false)
  })
})
