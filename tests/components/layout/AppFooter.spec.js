import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import { routes } from '@/router/routes'
import { SOCIAL_LINKS, whatsappUrl } from '@/core/config/social'

function mountFooter(props = {}) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(AppFooter, { props, global: { plugins: [router] } })
}

const year = String(new Date().getFullYear())

describe('AppFooter', () => {
  // BGSI-320: no "Navegación" nor "Contacto" columns (they are in the header menu)
  it('shows the brand, "¿Hablamos?" and Legal', () => {
    const wrapper = mountFooter()
    const titles = wrapper.findAll('h2').map((h) => h.text())

    expect(wrapper.find('img').exists()).toBe(true)
    expect(titles).toEqual(['¿Hablamos?', 'Legal'])
    expect(wrapper.text()).not.toContain('Navegación')
    expect(wrapper.find('a[href="/soluciones"]').exists()).toBe(false)
  })

  it('links to the three legal pages and shows the current year', () => {
    const wrapper = mountFooter()

    expect(wrapper.find('a[href="/aviso-legal"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/privacidad"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/cookies"]').exists()).toBe(true)
    expect(wrapper.text()).toContain(`© ${year} BG Sistemas Informáticos. Todos los derechos reservados.`)
  })
})

describe('AppFooter: social networks (BGSI-320)', () => {
  it('shows Facebook, Instagram and LinkedIn as icons, in that order, in a new tab', () => {
    const links = mountFooter().findAll('.app-footer__social a')

    expect(links.map((link) => link.attributes('href'))).toEqual(SOCIAL_LINKS.map((network) => network.url))
    expect(links.map((link) => link.attributes('title'))).toEqual(['Facebook', 'Instagram', 'LinkedIn'])
    links.forEach((link) => {
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener')
      expect(link.find('svg.social-icon').exists()).toBe(true)
      expect(link.text()).toBe('') // only the icon: the name is in aria-label
    })
    expect(links[0].attributes('aria-label')).toBe('Facebook de BG Sistemas (se abre en una pestaña nueva)')
  })
})

describe('AppFooter: WhatsApp (BGSI-320)', () => {
  it('"Escríbenos por WhatsApp" opens the chat with the message, without showing the number', () => {
    const link = mountFooter().find('[data-test="footer-whatsapp"]')

    expect(link.attributes('href')).toBe(whatsappUrl())
    expect(link.attributes('target')).toBe('_blank')
    expect(link.find('svg.whatsapp-icon').exists()).toBe(true)
    expect(link.text()).toContain('Escríbenos por WhatsApp')
    expect(link.text()).not.toContain('615')
  })
})

describe('AppFooter: compact, admin area (BGSI-324)', () => {
  it('shows only the copyright bar', () => {
    const wrapper = mountFooter({ compact: true })

    expect(wrapper.classes()).toContain('app-footer--compact')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.findAll('h2')).toHaveLength(0)
    expect(wrapper.findAll('a')).toHaveLength(0)
    expect(wrapper.text()).toBe(`© ${year} BG Sistemas Informáticos. Todos los derechos reservados.`)
  })
})
