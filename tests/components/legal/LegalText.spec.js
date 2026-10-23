import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import LegalText from '@/components/legal/LegalText.vue'

// BGSI-321: the parts of a paragraph of the legal pages
describe('LegalText', () => {
  it('writes texts, bold texts and links (inside the website and to other websites)', () => {
    const parts = ['Hola ', { strong: 'negrita' }, ' ', { to: '/contacto', text: 'contacto' }, ' ', { href: 'https://www.aepd.es', text: 'AEPD' }]
    const wrapper = mount({ components: { LegalText }, template: '<p><LegalText :parts="parts" /></p>', data: () => ({ parts }) },
      { global: { stubs: { RouterLink: RouterLinkStub } } })

    expect(wrapper.text()).toBe('Hola negrita contacto AEPD')
    expect(wrapper.find('strong').text()).toBe('negrita')
    expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('/contacto')
    const external = wrapper.find('a[href="https://www.aepd.es"]')
    expect(external.attributes('target')).toBe('_blank')
    expect(external.attributes('rel')).toBe('noopener')
  })
})
