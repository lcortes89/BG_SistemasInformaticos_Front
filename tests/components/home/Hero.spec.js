import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Hero from '@/components/home/Hero.vue'

const mountHero = () => mount(Hero)

describe('Hero', () => {
  it('renders the title', () => {
    expect(mountHero().text()).toContain('Digitaliza tu negocio hostelero')
  })

  it('renders the new subtitle (BGSI-222)', () => {
    expect(mountHero().text()).toContain('Transformamos la gestión de tu restaurante o PYME')
  })

  it('has no "Ver Soluciones" button: the menu already links to Soluciones', () => {
    const wrapper = mountHero()

    expect(wrapper.text()).not.toContain('Ver Soluciones')
    expect(wrapper.findAll('a')).toHaveLength(0)
  })
})
