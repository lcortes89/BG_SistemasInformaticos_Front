import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { fakeApi, page } from '../../helpers/fake-api'
import AdminBrandsView from '@/views/admin/AdminBrandsView.vue'
import AdminClientsView from '@/views/admin/AdminClientsView.vue'
import AdminServicesView from '@/views/admin/AdminServicesView.vue'

// BGSI-266: the admin screens working together with their table, form and dialogs.
// Only the HTTP calls are fake (fakeApi); everything else is the real code
const brandDto = { id: 1, name: 'BDP', description: 'TPV', category: 'Software', logoUrl: null, active: true, serviceCount: 2 }
const clientDto = { id: 2, name: 'Bar La Plaza', businessType: 'Bar', testimonial: 'Great', logoUrl: null, rating: 5, published: true }
const serviceDto = { id: 3, name: 'BDP One', description: 'TPV', imageUrl: null, featured: true, brandId: 1, brandName: 'BDP' }

const buttonWithText = (wrapper, text) => wrapper.findAll('button').find((button) => button.text().includes(text))

async function mountView(view) {
  const wrapper = mount(view, { attachTo: document.body })
  await flushPromises()
  return wrapper
}

describe('admin CRUD screens', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('Marcas: lists the brands, creates one and deletes one after confirming', async () => {
    const calls = fakeApi({
      'GET /admin/brands': page([brandDto]),
      'POST /admin/brands': (body) => ({ ...brandDto, id: 9, ...body }),
      'DELETE /admin/brands/1': null,
    })
    const wrapper = await mountView(AdminBrandsView)
    expect(wrapper.text()).toContain('BDP')
    expect(wrapper.text()).toContain('1 marca')

    await buttonWithText(wrapper, '+ Nueva marca').trigger('click')
    await wrapper.find('#brand-name').setValue('PUDU')
    await wrapper.find('#brand-category').setValue('Robots')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(calls.some((call) => call.key === 'POST /admin/brands' && call.body.name === 'PUDU')).toBe(true)
    expect(wrapper.find('[role="status"]').text()).toBe('Marca creada')

    await buttonWithText(wrapper, 'Borrar').trigger('click')
    await wrapper.find('.confirm-dialog__confirm').trigger('click')
    await flushPromises()
    expect(calls.map((call) => call.key)).toContain('DELETE /admin/brands/1')
    expect(wrapper.find('[role="status"]').text()).toBe('Marca BDP borrada')
  })

  it('Marcas: explains why a brand with products cannot be deleted (409)', async () => {
    fakeApi({ 'GET /admin/brands': page([brandDto]) })
    vi.spyOn((await import('@/core/apis/base/BaseRepository')).http, 'delete')
      .mockRejectedValue(Object.assign(new Error('conflict'), { response: { status: 409, data: { message: 'Brand has services' } } }))
    const wrapper = await mountView(AdminBrandsView)

    await buttonWithText(wrapper, 'Borrar').trigger('click')
    await wrapper.find('.confirm-dialog__confirm').trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toContain('esta marca tiene productos')
  })

  it('Clientes: lists the clients and edits one', async () => {
    const calls = fakeApi({
      'GET /admin/clients': page([clientDto]),
      'PUT /admin/clients/2': (body) => ({ ...clientDto, ...body }),
    })
    const wrapper = await mountView(AdminClientsView)
    expect(wrapper.text()).toContain('Bar La Plaza')

    await buttonWithText(wrapper, 'Editar').trigger('click')
    expect(wrapper.find('#client-name').element.value).toBe('Bar La Plaza')
    await wrapper.find('#client-name').setValue('Bar La Plaza Mayor')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(calls.find((call) => call.key === 'PUT /admin/clients/2').body.name).toBe('Bar La Plaza Mayor')
    expect(wrapper.find('[role="status"]').text()).toBe('Cliente actualizado')
  })

  it('Productos: lists the products and filters them by brand', async () => {
    const calls = fakeApi({
      'GET /admin/services': page([serviceDto]),
      'GET /admin/brands': page([brandDto]),
    })
    const wrapper = await mountView(AdminServicesView)
    expect(wrapper.text()).toContain('BDP One')

    await wrapper.find('.admin-page__tools select').setValue('1')
    await flushPromises()

    const lastServicesCall = calls.filter((call) => call.key === 'GET /admin/services').at(-1)
    expect(lastServicesCall.body.params).toEqual(expect.objectContaining({ brandId: 1 }))
  })

  it('shows the error of the backend when the list cannot be loaded', async () => {
    fakeApi({})
    const wrapper = await mountView(AdminClientsView)

    expect(wrapper.find('[role="alert"]').text()).toContain('Not mocked')
  })
})
