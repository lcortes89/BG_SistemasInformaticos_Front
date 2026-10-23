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
    expect(wrapper.text()).toContain('Oculta')
    expect(wrapper.text()).toContain('PU')

    // BGSI-312: the actions are in the "⋯" menu
    expect(await rowActionLabels(wrapper)).toEqual(['Editar', 'Borrar'])
    await chooseRowAction(wrapper, 'Editar')
    await chooseRowAction(wrapper, 'Borrar')

    expect(wrapper.emitted('edit')[0]).toEqual([hidden])
    expect(wrapper.emitted('delete')[0]).toEqual([hidden])
  })

  it('shows an empty state', () => {
    const wrapper = mount(BrandsTable, { props: { brands: [] } })

    expect(wrapper.text()).toContain('Todavía no hay marcas')
  })
})
