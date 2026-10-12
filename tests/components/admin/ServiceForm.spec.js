import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceForm from '@/components/admin/ServiceForm.vue'
import BrandModel from '@/core/models/brand/BrandModel'

const brands = [new BrandModel(1, 'BDP', '', 'Software', null), new BrandModel(4, 'PUDU', '', 'Robots', null)]

describe('ServiceForm', () => {
  it('lists the brands and requires one', async () => {
    const wrapper = mount(ServiceForm, { props: { brands } })
    await wrapper.find('#service-name').setValue('BellaBot')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('#service-brand').text()).toContain('PUDU')
    expect(wrapper.text()).toContain('Elige la marca del producto')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('submits the product with its brand and the featured flag', async () => {
    const wrapper = mount(ServiceForm, { props: { brands } })
    await wrapper.find('#service-name').setValue('BellaBot')
    await wrapper.find('#service-brand').setValue(4)
    await wrapper.find('#service-featured').setValue(true)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0]).toMatchObject({ name: 'BellaBot', brandId: 4, featured: true })
  })
})
