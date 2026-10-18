import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactInfo from '@/components/contact/ContactInfo.vue'

describe('ContactInfo', () => {
  it('shows the WhatsApp number with the green icon (BGSI-242)', () => {
    const link = mount(ContactInfo).find('a[href="https://wa.me/34615471066"]')

    expect(link.find('svg.whatsapp-icon').exists()).toBe(true)
    expect(link.text()).toBe('+34 615 471 066')
    expect(link.attributes('target')).toBe('_blank')
  })
})

describe('ContactInfo: office map (BGSI-250)', () => {
  it('shows the office address', () => {
    expect(mount(ContactInfo).text()).toContain('27700 Ribadeo (Lugo)')
  })

  it('shows an OpenStreetMap map (no cookies) that loads only when it is visible', () => {
    const map = mount(ContactInfo).find('iframe')

    expect(map.attributes('src')).toContain('https://www.openstreetmap.org/export/embed.html')
    expect(map.attributes('src')).toContain('marker=43.5363%2C-7.0404')
    expect(map.attributes('loading')).toBe('lazy')
    expect(map.attributes('title')).toContain('Ribadeo')
  })

  it('opens the route in Google Maps in a new tab', () => {
    const link = mount(ContactInfo).find('.contact-info__directions')

    expect(link.attributes('href')).toBe('https://www.google.com/maps/dir/?api=1&destination=27700+Ribadeo,+Spain')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.text()).toContain('Cómo llegar')
  })
})
