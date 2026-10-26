import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FilterNoResults from '@/components/admin/FilterNoResults.vue'

// BGSI-302: empty list because of the filters
describe('FilterNoResults', () => {
  it('says that nothing matches and offers to clear the filters', async () => {
    const wrapper = mount(FilterNoResults, { props: { what: 'clientes' } })

    expect(wrapper.text()).toContain('No hay clientes que coincidan con la búsqueda.')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })
})
