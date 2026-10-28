import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import FeaturedServices from '@/components/home/FeaturedServices.vue'
import { routes } from '@/router/routes'

function mountWith(props) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(FeaturedServices, { props, global: { plugins: [router] } })
}

const services = [
  { id: 1, name: 'BDP One', description: 'Multiplatform', brandName: 'BDP' },
  { id: 2, name: 'Terminal de cobro CashGuard', description: 'Cash', brandName: 'CashGuard' },
  { id: 3, name: 'Robot de servicio PUDU', description: 'Robot', brandName: 'PUDU' },
]

describe('FeaturedServices', () => {
  it('shows the spinner while loading', () => {
    const wrapper = mountWith({ isLoading: true })

    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })

  it('shows one card per featured service', () => {
    const wrapper = mountWith({ services })

    expect(wrapper.findAll('article')).toHaveLength(3)
    expect(wrapper.text()).toContain('BDP One')
  })

  it('shows a friendly message when there are no featured services', () => {
    const wrapper = mountWith({ services: [] })

    expect(wrapper.text()).toContain('Muy pronto mostraremos')
  })

  it('shows the error message when the API fails', () => {
    const wrapper = mountWith({ error: 'No se pudo conectar con el servidor.' })

    expect(wrapper.find('[role="alert"]').text()).toBe('No se pudo conectar con el servidor.')
  })
})
