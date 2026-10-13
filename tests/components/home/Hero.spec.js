import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Hero from '@/components/home/Hero.vue'

const RouterLinkStub = {
  template: '<a><slot /></a>',
}

const mountHero = () => mount(Hero, { global: { stubs: { RouterLink: RouterLinkStub } } })

describe('Hero', () => {
  it('renders the title', () => {
    expect(mountHero().text()).toContain('Digitaliza tu negocio hostelero')
  })

  it('renders the new subtitle (BGSI-222)', () => {
    expect(mountHero().text()).toContain('Transformamos la gestión de tu restaurante o PYME')
  })

  it('renders the Ver Soluciones button', () => {
    expect(mountHero().text()).toContain('Ver Soluciones')
  })

  it('renders only one call-to-action link', () => {
    expect(mountHero().findAll('a').length).toBe(1)
  })
})
