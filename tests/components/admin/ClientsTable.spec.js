import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { chooseRowAction, rowActionLabels } from '../../helpers/row-actions'
import ClientsTable from '@/components/admin/ClientsTable.vue'
import ClientModel from '@/core/models/client/ClientModel'

describe('ClientsTable', () => {
  it('shows each client with its rating and status, and emits the actions', async () => {
    const hidden = new ClientModel(2, 'Pub Nocturno', 'Pub', 'Very good', null, 4, false)
    const wrapper = mount(ClientsTable, { props: { clients: [hidden] } })

    expect(wrapper.text()).toContain('Pub Nocturno')
    expect(wrapper.text()).toContain('Inactivo')
    expect(wrapper.find('[aria-label="Valoración: 4 de 5"]').exists()).toBe(true)

    // BGSI-312 / 310: the actions are in the "⋯" menu. A hidden client can be activated
    expect(await rowActionLabels(wrapper)).toEqual(['Editar', 'Activar', 'Borrar'])
    await chooseRowAction(wrapper, 'Editar')
    await chooseRowAction(wrapper, 'Activar')
    await chooseRowAction(wrapper, 'Borrar')

    expect(wrapper.emitted('edit')[0]).toEqual([hidden])
    expect(wrapper.emitted('toggle')[0]).toEqual([hidden])
    expect(wrapper.emitted('delete')[0]).toEqual([hidden])
    expect(wrapper.find('tbody tr').classes()).toContain('admin-table__row--inactive')
  })

  it('offers "Inactivar" for a published client (BGSI-310)', async () => {
    const published = new ClientModel(1, 'Bar La Plaza', 'Bar', 'Great', null, 5, true)
    const wrapper = mount(ClientsTable, { props: { clients: [published] } })

    expect(wrapper.text()).toContain('Activo')
    expect(await rowActionLabels(wrapper)).toEqual(['Editar', 'Inactivar', 'Borrar'])
    expect(wrapper.find('tbody tr').classes()).not.toContain('admin-table__row--inactive')
  })

  it('shows an empty state', () => {
    const wrapper = mount(ClientsTable, { props: { clients: [] } })

    expect(wrapper.text()).toContain('Todavía no hay clientes')
  })
})
