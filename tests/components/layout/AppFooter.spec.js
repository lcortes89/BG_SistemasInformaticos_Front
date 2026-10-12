import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import { routes } from '@/router/routes'

function mountFooter() {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(AppFooter, { global: { plugins: [router] } })
}

describe('AppFooter', () => {
  it('shows the four columns: brand, navigation, contact and legal', () => {
    const wrapper = mountFooter()
    const titles = wrapper.findAll('h2').map((h) => h.text())

    expect(wrapper.find('img').exists()).toBe(true)
    expect(titles).toEqual(['Navegación', 'Contacto', 'Legal'])
  })

  it('links to WhatsApp and to the privacy policy, and shows the current year', () => {
    const wrapper = mountFooter()

    expect(wrapper.find('a[href="https://wa.me/34615471066"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/privacidad"]').exists()).toBe(true)
    expect(wrapper.text()).toContain(String(new Date().getFullYear()))
  })
})
