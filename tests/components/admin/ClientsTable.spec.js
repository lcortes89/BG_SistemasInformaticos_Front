import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ClientsTable from '@/components/admin/ClientsTable.vue'
import ClientModel from '@/core/models/client/ClientModel'

describe('ClientsTable', () => {
  it('shows each client with its rating and status, and emits the actions', async () => {
    const hidden = new ClientModel(2, 'Pub Nocturno', 'Pub', 'Very good', null, 4, false)
    const wrapper = mount(ClientsTable, { props: { clients: [hidden] } })

    expect(wrapper.text()).toContain('Pub Nocturno')
    expect(wrapper.text()).toContain('Oculto')
    expect(wrapper.find('[aria-label="Valoración: 4 de 5"]').exists()).toBe(true)

    const [editButton, deleteButton] = wrapper.findAll('button')
    await editButton.trigger('click')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('edit')[0]).toEqual([hidden])
    expect(wrapper.emitted('delete')[0]).toEqual([hidden])
  })

  it('shows an empty state', () => {
    const wrapper = mount(ClientsTable, { props: { clients: [] } })

    expect(wrapper.text()).toContain('Todavía no hay clientes')
  })
})
