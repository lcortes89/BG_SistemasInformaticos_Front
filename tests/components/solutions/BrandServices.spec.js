import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import BrandServices from '@/components/solutions/BrandServices.vue'
import { routes } from '@/router/routes'

const brand = { id: 1, name: 'BDP' }

// The product sheets have a link to Contacto, so the router is needed (BGSI-206)
function mountServices(props) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(BrandServices, { props: { brand, ...props }, global: { plugins: [router] } })
}

describe('BrandServices', () => {
  it('shows grey product sheets while the products are loading (BGSI-243)', () => {
    const wrapper = mountServices({ isLoading: true })

    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
    expect(wrapper.findAll('.skeleton--product')).toHaveLength(2)
  })

  it('shows one sheet per product of the brand', () => {
    const services = [
      { id: 1, name: 'BDP .Net', description: 'Classic', brandName: 'BDP' },
      { id: 2, name: 'BDP One', description: 'Multiplatform', brandName: 'BDP' },
    ]
    const wrapper = mountServices({ services })

    expect(wrapper.text()).toContain('Productos de BDP')
    expect(wrapper.findAll('article')).toHaveLength(2)
  })

  it('shows a message when the brand has no products', () => {
    const wrapper = mountServices({ services: [] })

    expect(wrapper.text()).toContain('todavía no tiene productos')
  })
})
