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

describe('ServiceForm: official page of the maker', () => {
  async function fillRequired(wrapper) {
    await wrapper.find('#service-name').setValue('BellaBot')
    await wrapper.find('#service-brand').setValue(4)
  }

  it('sends the official link', async () => {
    const wrapper = mount(ServiceForm, { props: { brands } })
    await fillRequired(wrapper)
    await wrapper.find('#service-official').setValue('https://www.pudurobotics.com/bellabot')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0]).toMatchObject({ officialUrl: 'https://www.pudurobotics.com/bellabot' })
  })

  it('does not allow a link without http:// or https://', async () => {
    const wrapper = mount(ServiceForm, { props: { brands } })
    await fillRequired(wrapper)
    await wrapper.find('#service-official').setValue('www.pudurobotics.com')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Debe empezar por http:// o https://')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})

describe('ServiceForm: active (BGSI-310)', () => {
  it('a new product is active', async () => {
    const wrapper = mount(ServiceForm, { props: { brands } })
    await wrapper.find('#service-name').setValue('BellaBot')
    await wrapper.find('#service-brand').setValue(4)

    expect(wrapper.find('#service-active').element.checked).toBe(true)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0]).toMatchObject({ active: true })
  })

  it('keeps an inactive product inactive, and can activate it', async () => {
    const service = { name: 'BDP Retail', brandId: 1, description: '', imageUrl: '', featured: false, active: false }
    const wrapper = mount(ServiceForm, { props: { brands, service } })

    expect(wrapper.find('#service-active').element.checked).toBe(false)
    await wrapper.find('#service-active').setValue(true)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0]).toMatchObject({ active: true })
  })
})
