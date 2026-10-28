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

  // BGSI-298
  it('says what the button does and closes the menu with Esc', async () => {
    const wrapper = mountHeader()
    const toggle = wrapper.find('[data-test="menu-toggle"]')
    expect(toggle.attributes('aria-label')).toBe('Abrir menú')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-label')).toBe('Cerrar menú')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('nav').classes()).not.toContain('is-open')
    wrapper.unmount()
  })
})

describe('AppHeader on scroll (BGSI-210)', () => {
  async function scrollTo(y) {
    Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await Promise.resolve()
  }

  it('hides when scrolling down and comes back when scrolling up', async () => {
    const wrapper = mountHeader()
    const header = wrapper.find('header')

    await scrollTo(100)
    expect(header.classes()).toContain('is-translucent')

    await scrollTo(500)
    expect(header.classes()).toContain('is-hidden')

    await scrollTo(450)
    expect(header.classes()).not.toContain('is-hidden')

    await scrollTo(0)
    wrapper.unmount()
  })

  it('never hides while the mobile menu is open', async () => {
    const wrapper = mountHeader()

    await wrapper.find('[data-test="menu-toggle"]').trigger('click')
    await scrollTo(300)
    await scrollTo(700)

    expect(wrapper.find('header').classes()).not.toContain('is-hidden')

    await scrollTo(0)
    wrapper.unmount()
  })
})

describe('AppHeader transparent over the hero (BGSI-225)', () => {
  it('is transparent on pages with hero and solid on the others', () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    const overHero = mount(AppHeader, { props: { overlay: true }, global: { plugins: [router] } })
    const normal = mount(AppHeader, { props: { overlay: false }, global: { plugins: [router] } })

    expect(overHero.find('header').classes()).not.toContain('is-solid')
    expect(normal.find('header').classes()).toContain('is-solid')

    overHero.unmount()
    normal.unmount()
  })
})

describe('AppHeader divider line (BGSI-226)', () => {
  async function scrollTo(y) {
    Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await Promise.resolve()
  }

  it('shows the line over the hero and hides it when the page scrolls', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    const wrapper = mount(AppHeader, { props: { overlay: true }, global: { plugins: [router] } })
    const header = wrapper.find('header')

    expect(header.classes()).toContain('has-divider')

    await scrollTo(100)
    expect(header.classes()).not.toContain('has-divider')

    await scrollTo(0)
    expect(header.classes()).toContain('has-divider')
    wrapper.unmount()
  })

  it('never shows the line on pages without hero', () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    const wrapper = mount(AppHeader, { props: { overlay: false }, global: { plugins: [router] } })

    expect(wrapper.find('header').classes()).not.toContain('has-divider')
    wrapper.unmount()
  })
})

describe('AppHeader: admin login (BGSI-256)', () => {
  function mountWithoutNav() {
    const router = createRouter({ history: createMemoryHistory(), routes })
    return mount(AppHeader, { props: { showNav: false }, global: { plugins: [router] } })
  }

  it('keeps the logo but hides the public menu and the mobile button', () => {
    const wrapper = mountWithoutNav()

    expect(wrapper.find('img').attributes('alt')).toBe('BG Sistemas Informáticos')
    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.find('[data-test="menu-toggle"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Soluciones')
    expect(wrapper.text()).not.toContain('Contacto')
  })
})

describe('AppHeader: Inicio link (BGSI-263)', () => {
  async function mountAt(path) {
    const router = createRouter({ history: createMemoryHistory(), routes })
    router.push(path)
    await router.isReady()
    return mount(AppHeader, { global: { plugins: [router] } })
  }

  it('shows "Inicio" as the first link of the menu', async () => {
    const wrapper = await mountAt('/')

    const first = wrapper.findAll('.app-header__link')[0]
    expect(first.text()).toBe('Inicio')
    expect(first.attributes('href')).toBe('/')
  })

  it('marks Inicio only when you are on the home page', async () => {
    const home = await mountAt('/')
    const solutions = await mountAt('/soluciones')

    expect(home.findAll('.app-header__link')[0].classes()).toContain('router-link-active')
    expect(solutions.findAll('.app-header__link')[0].classes()).not.toContain('router-link-active')
  })

  it('the logo also goes home and says so to screen readers', async () => {
    const wrapper = await mountAt('/soluciones')

    const logoLink = wrapper.find('.app-header__brand')
    expect(logoLink.attributes('href')).toBe('/')
    expect(logoLink.attributes('aria-label')).toBe('Ir a Inicio')
  })
})
