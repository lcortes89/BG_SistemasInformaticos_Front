import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import StatCard from '@/components/admin/StatCard.vue'
import { routes } from '@/router/routes'

function mountCard(props) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(StatCard, { props, global: { plugins: [router] } })
}

describe('StatCard', () => {
  it('shows the label, the number, the detail and the quick link', () => {
    const wrapper = mountCard({
      label: 'Contactos nuevos', value: 3, detail: 'de 12 en total',
      to: { name: 'admin-contacts' }, linkLabel: 'Revisar',
    })

    expect(wrapper.text()).toContain('Contactos nuevos')
    expect(wrapper.find('.stat-card__value').text()).toBe('3')
    expect(wrapper.text()).toContain('de 12 en total')
    expect(wrapper.find('a').attributes('href')).toBe('/admin/contactos')
  })

  it('shows a zero instead of an empty card (BGSI-141)', () => {
    const wrapper = mountCard({ label: 'Clientes publicados' })

    expect(wrapper.find('.stat-card__value').text()).toBe('0')
  })

  it('shows a spinner while loading (BGSI-192)', () => {
    const wrapper = mountCard({ label: 'Marcas activas', value: 4, isLoading: true })

    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('4')
  })
})
