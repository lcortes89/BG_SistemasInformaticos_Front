import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { chooseRowAction, rowActionLabels } from '../../helpers/row-actions'
import ServicesTable from '@/components/admin/ServicesTable.vue'
import ServiceModel from '@/core/models/service/ServiceModel'

// BGSI-310: the products table with the "Estado" column and "Activar / Inactivar"
const product = (active) => new ServiceModel(3, 'BDP One', 'TPV', null, 1, 'BDP', true, '', [], [], null, active)

describe('ServicesTable', () => {
  it('shows an active product and offers "Inactivar"', async () => {
    const wrapper = mount(ServicesTable, { props: { services: [product(true)] } })

    expect(wrapper.text()).toContain('BDP One')
    expect(wrapper.text()).toContain('Destacado')
    expect(wrapper.find('[data-label="Estado"]').text()).toBe('Activo')
    expect(await rowActionLabels(wrapper)).toEqual(['Editar', 'Inactivar', 'Borrar'])
    expect(wrapper.find('tbody tr').classes()).not.toContain('admin-table__row--inactive')
  })

  it('shows an inactive product faded, offers "Activar" and emits the actions', async () => {
    const hidden = product(false)
    const wrapper = mount(ServicesTable, { props: { services: [hidden] } })

    expect(wrapper.find('[data-label="Estado"]').text()).toBe('Inactivo')
    expect(wrapper.find('tbody tr').classes()).toContain('admin-table__row--inactive')
    expect(await rowActionLabels(wrapper)).toEqual(['Editar', 'Activar', 'Borrar'])

    await chooseRowAction(wrapper, 'Editar')
    await chooseRowAction(wrapper, 'Activar')
    await chooseRowAction(wrapper, 'Borrar')

    expect(wrapper.emitted('edit')[0]).toEqual([hidden])
    expect(wrapper.emitted('toggle')[0]).toEqual([hidden])
    expect(wrapper.emitted('delete')[0]).toEqual([hidden])
  })

  it('shows an empty state', () => {
    const wrapper = mount(ServicesTable, { props: { services: [] } })

    expect(wrapper.text()).toContain('No hay productos para este filtro')
  })
})
