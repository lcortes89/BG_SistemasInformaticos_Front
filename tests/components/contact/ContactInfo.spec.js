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
