import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { chooseRowAction, rowActionLabels } from '../../helpers/row-actions'
import BrandsTable from '@/components/admin/BrandsTable.vue'
import BrandModel from '@/core/models/brand/BrandModel'

describe('BrandsTable', () => {
  it('shows each brand with its products and visibility, and emits the actions', async () => {
    const hidden = new BrandModel(2, 'PUDU', '', 'Robots', null, false, 0)
    const wrapper = mount(BrandsTable, { props: { brands: [hidden] } })

    expect(wrapper.text()).toContain('PUDU')
    expect(wrapper.text()).toContain('Inactivo')
    expect(wrapper.text()).toContain('PU')

    // BGSI-312 / 310: the actions are in the "⋯" menu. A hidden brand can be activated
    expect(await rowActionLabels(wrapper)).toEqual(['Editar', 'Activar', 'Borrar'])
    await chooseRowAction(wrapper, 'Editar')
    await chooseRowAction(wrapper, 'Activar')
    await chooseRowAction(wrapper, 'Borrar')

    expect(wrapper.emitted('edit')[0]).toEqual([hidden])
    expect(wrapper.emitted('toggle')[0]).toEqual([hidden])
    expect(wrapper.emitted('delete')[0]).toEqual([hidden])
    expect(wrapper.find('tbody tr').classes()).toContain('admin-table__row--inactive')
  })

  it('offers "Inactivar" for an active brand (BGSI-310)', async () => {
    const active = new BrandModel(1, 'BDP', '', 'Software', null, true, 2)
    const wrapper = mount(BrandsTable, { props: { brands: [active] } })

    expect(wrapper.text()).toContain('Activo')
    expect(await rowActionLabels(wrapper)).toEqual(['Editar', 'Inactivar', 'Borrar'])
  })

  it('shows an empty state', () => {
    const wrapper = mount(BrandsTable, { props: { brands: [] } })

    expect(wrapper.text()).toContain('Todavía no hay marcas')
  })
})
