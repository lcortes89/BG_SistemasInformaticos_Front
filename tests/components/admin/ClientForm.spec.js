import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ClientForm from '@/components/admin/ClientForm.vue'
import ClientModel from '@/core/models/client/ClientModel'

describe('ClientForm', () => {
  it('requires name, business type and testimonial (BGSI-137)', async () => {
    const wrapper = mount(ClientForm)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('El nombre es obligatorio')
    expect(wrapper.text()).toContain('El tipo de negocio es obligatorio')
    expect(wrapper.text()).toContain('El testimonio es obligatorio')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('starts with the client data when editing and submits the changes', async () => {
    const client = new ClientModel(1, 'Bar La Plaza', 'Bar', 'Great service', null, 5, true)
    const wrapper = mount(ClientForm, { props: { client } })

    expect(wrapper.find('#client-name').element.value).toBe('Bar La Plaza')
    await wrapper.find('#client-rating').setValue(3)
    await wrapper.find('#client-published').setValue(false)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0]).toMatchObject({ name: 'Bar La Plaza', rating: 3, published: false })
  })
})
