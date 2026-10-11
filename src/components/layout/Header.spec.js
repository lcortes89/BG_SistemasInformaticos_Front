import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from './Header.vue'

const RouterLinkStub = {
  template: '<a><slot /></a>',
}

describe('Header', () => {
  it('renders the logo image', () => {
    const wrapper = mount(Header, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('renders the navigation links', () => {
    const wrapper = mount(Header, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.text()).toContain('Soluciones')
    expect(wrapper.text()).toContain('Tarifas')
    expect(wrapper.text()).toContain('Nuestros Clientes')
  })

  it('renders the Contacto CTA button', () => {
    const wrapper = mount(Header, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.text()).toContain('Contacto')
  })
})