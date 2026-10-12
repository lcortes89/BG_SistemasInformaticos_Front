import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import { routes } from '@/router/routes'

function mountHeader() {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(AppHeader, { global: { plugins: [router] } })
}

describe('AppHeader', () => {
  it('shows the logo, the main links and the contact button', () => {
    const wrapper = mountHeader()

    expect(wrapper.find('img').attributes('alt')).toBe('BG Sistemas Informáticos')
    expect(wrapper.text()).toContain('Soluciones')
    expect(wrapper.text()).toContain('Tarifas')
    expect(wrapper.text()).toContain('Nuestros Clientes')
    expect(wrapper.text()).toContain('Contacto')
  })

  it('does not show any login or register button (admin is reached by URL)', () => {
    const text = mountHeader().text().toLowerCase()

    expect(text).not.toContain('login')
    expect(text).not.toContain('iniciar sesión')
    expect(text).not.toContain('registr')
  })

  it('opens and closes the mobile menu', async () => {
    const wrapper = mountHeader()
    const toggle = wrapper.find('[data-test="menu-toggle"]')
    const nav = wrapper.find('nav')

    expect(nav.classes()).not.toContain('is-open')

    await toggle.trigger('click')
    expect(nav.classes()).toContain('is-open')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await toggle.trigger('click')
    expect(nav.classes()).not.toContain('is-open')
  })
})
