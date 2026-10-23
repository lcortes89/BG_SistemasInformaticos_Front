import { describe, it, expect } from 'vitest'
import { SOCIAL_LINKS, WHATSAPP, whatsappUrl } from '@/core/config/social'

// BGSI-320: one place for the social networks and WhatsApp
describe('social config', () => {
  it('has the three networks of the company', () => {
    expect(SOCIAL_LINKS.map((network) => network.key)).toEqual(['facebook', 'instagram', 'linkedin'])
    expect(SOCIAL_LINKS[0].url).toBe('https://www.facebook.com/bgconsultoria/')
    SOCIAL_LINKS.forEach((network) => expect(network.url).toMatch(/^https:\/\//))
  })

  it('builds the "click to chat" link with the message already written', () => {
    expect(whatsappUrl()).toBe(`https://wa.me/34615471066?text=${encodeURIComponent(WHATSAPP.message)}`)
    expect(whatsappUrl('Hola y adiós')).toBe('https://wa.me/34615471066?text=Hola%20y%20adi%C3%B3s')
  })
})
