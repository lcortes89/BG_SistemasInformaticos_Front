import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from './Header.vue'

const RouterLinkStub = {
  template: '<a><slot /></a>',
}

function setScrollY(value) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true })
  window.dispatchEvent(new Event('scroll'))
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

describe('Header scroll behavior', () => {
  it('stays visible at the top of the page', () => {
    const wrapper = mount(Header, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.classes()).not.toContain('header--hidden')
  })

  it('hides when scrolling down past the threshold', async () => {
    const wrapper = mount(Header, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    setScrollY(50)
    setScrollY(150)
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).toContain('header--hidden')
  })

  it('shows again when scrolling back up', async () => {
    const wrapper = mount(Header, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    setScrollY(50)
    setScrollY(150)
    await wrapper.vm.$nextTick()
    setScrollY(80)
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).not.toContain('header--hidden')
  })
})