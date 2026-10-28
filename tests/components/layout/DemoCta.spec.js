import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import DemoCta from '@/components/layout/DemoCta.vue'
import { routes } from '@/router/routes'

function mountCta() {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(DemoCta, { global: { plugins: [router] } })
}

describe('DemoCta', () => {
  it('shows the title, the subtitle and the button', () => {
    const wrapper = mountCta()

    expect(wrapper.find('h2').text()).toBe('¿Quieres ver nuestros sistemas funcionando?')
    expect(wrapper.text()).toContain('Solicita tu demo y te lo mostramos en 30 minutos.')
    expect(wrapper.find('a').text()).toBe('Solicita tu demo')
  })

  it('links to Contacto asking for a demo', () => {
    const wrapper = mountCta()

    expect(wrapper.find('a').attributes('href')).toBe('/contacto?interes=demo')
  })
})
