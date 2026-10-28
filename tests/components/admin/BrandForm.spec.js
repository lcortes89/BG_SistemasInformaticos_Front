import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BrandForm from '@/components/admin/BrandForm.vue'
import BrandModel from '@/core/models/brand/BrandModel'

describe('BrandForm', () => {
  it('does not submit without name and category', async () => {
    const wrapper = mount(BrandForm)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('El nombre es obligatorio')
    expect(wrapper.text()).toContain('La categoría es obligatoria')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('starts with the brand data when editing and submits the changes', async () => {
    const brand = new BrandModel(1, 'BDP', 'TPV', 'Software', null, true, 2)
    const wrapper = mount(BrandForm, { props: { brand } })

    expect(wrapper.find('#brand-name').element.value).toBe('BDP')
    await wrapper.find('#brand-active').setValue(false)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0]).toMatchObject({ name: 'BDP', category: 'Software', active: false })
  })

  it('shows the server error', () => {
    const wrapper = mount(BrandForm, { props: { serverError: 'Brand with id 9 not found' } })

    expect(wrapper.find('[role="alert"]').text()).toBe('Brand with id 9 not found')
  })
})
