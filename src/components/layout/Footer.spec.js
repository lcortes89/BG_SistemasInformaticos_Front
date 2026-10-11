import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from './Footer.vue'

const RouterLinkStub = {
  template: '<a><slot /></a>',
}

describe('Footer', () => {
  it('renders the footer logo', () => {
    const wrapper = mount(Footer, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('renders the social media links', () => {
    const wrapper = mount(Footer, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toContain('https://www.linkedin.com/in/javi-guty-8112ab399/')
    expect(hrefs).toContain('https://www.instagram.com/guty.ribadeo')
    expect(hrefs).toContain('https://www.facebook.com/share/1FiV6BGZQx/')
  })

  it('renders the navigation links', () => {
    const wrapper = mount(Footer, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.text()).toContain('Soluciones')
    expect(wrapper.text()).toContain('Tarifas')
    expect(wrapper.text()).toContain('Nuestros Clientes')
  })

  it('renders the contact information', () => {
    const wrapper = mount(Footer, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.text()).toContain('servicios@consultoriass.es')
    expect(wrapper.text()).toContain('615 471 066')
  })

  it('renders the legal links', () => {
    const wrapper = mount(Footer, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.text()).toContain('Política de Privacidad')
    expect(wrapper.text()).toContain('Términos y Condiciones')
  })
})