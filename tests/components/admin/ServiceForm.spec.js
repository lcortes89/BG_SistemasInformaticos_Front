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

describe('ServiceForm: full product sheet (BGSI-205)', () => {
  it('shows the sheet of the product being edited, one item per line', () => {
    const service = { name: 'BDP One', brandId: 1, description: '', imageUrl: '', featured: false,
      longDescription: 'Long text', features: ['Orders', 'Kitchen'], sectors: ['Bars'] }

    const wrapper = mount(ServiceForm, { props: { brands, service } })

    expect(wrapper.find('#service-long').element.value).toBe('Long text')
    expect(wrapper.find('#service-features').element.value).toBe('Orders\nKitchen')
    expect(wrapper.find('#service-sectors').element.value).toBe('Bars')
  })

  it('does not allow more than 6 features', async () => {
    const wrapper = mount(ServiceForm, { props: { brands } })
    await wrapper.find('#service-name').setValue('BellaBot')
    await wrapper.find('#service-brand').setValue(4)
    await wrapper.find('#service-features').setValue('1\n2\n3\n4\n5\n6\n7')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Máximo 6 funciones')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})
