import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Hero from './Hero.vue'

const RouterLinkStub = {
  template: '<a><slot /></a>',
}

describe('Hero', () => {
  it('renders the title', () => {
    const wrapper = mount(Hero, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.text()).toContain('Digitaliza tu negocio hostelero')
  })

  it('renders the subtitle', () => {
    const wrapper = mount(Hero, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.text()).toContain('Empresa especializada en el sector hostelero')
  })

  it('renders the Ver Soluciones button', () => {
    const wrapper = mount(Hero, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.text()).toContain('Ver Soluciones')
  })

  it('renders only one call-to-action link', () => {
    const wrapper = mount(Hero, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.findAll('a').length).toBe(1)
  })
})