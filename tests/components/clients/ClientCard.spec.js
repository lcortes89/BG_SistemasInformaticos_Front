import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ClientCard from '@/components/clients/ClientCard.vue'
import ClientModel from '@/core/models/client/ClientModel'

describe('ClientCard', () => {
  it('shows name, business type, rating and testimonial', () => {
    const client = new ClientModel(1, 'Bar La Plaza', 'Bar', 'Great service', null, 5)
    const wrapper = mount(ClientCard, { props: { client } })

    expect(wrapper.text()).toContain('Bar La Plaza')
    expect(wrapper.text()).toContain('Great service')
    expect(wrapper.find('[aria-label="Valoración: 5 de 5"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('BL')
  })
})
