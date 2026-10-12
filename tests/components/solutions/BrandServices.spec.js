import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandServices from '@/components/solutions/BrandServices.vue'

const brand = { id: 1, name: 'BDP' }

describe('BrandServices', () => {
  it('shows the spinner while the products are loading', () => {
    const wrapper = mount(BrandServices, { props: { brand, isLoading: true } })

    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })

  it('shows one card per product of the brand', () => {
    const services = [
      { id: 1, name: 'BDP .Net', description: 'Classic', brandName: 'BDP' },
      { id: 2, name: 'BDP One', description: 'Multiplatform', brandName: 'BDP' },
    ]
    const wrapper = mount(BrandServices, { props: { brand, services } })

    expect(wrapper.text()).toContain('Productos de BDP')
    expect(wrapper.findAll('article')).toHaveLength(2)
  })

  it('shows a message when the brand has no products', () => {
    const wrapper = mount(BrandServices, { props: { brand, services: [] } })

    expect(wrapper.text()).toContain('todavía no tiene productos')
  })
})
