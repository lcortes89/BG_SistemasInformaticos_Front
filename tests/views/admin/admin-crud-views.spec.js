import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { fakeApi, page } from '../../helpers/fake-api'
import { chooseRowAction } from '../../helpers/row-actions'
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

    await chooseRowAction(wrapper, 'Borrar')
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

    await chooseRowAction(wrapper, 'Borrar')
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

    await chooseRowAction(wrapper, 'Editar')
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

    await wrapper.find('#brand-filter').setValue('1')
    await flushPromises()

    const lastServicesCall = calls.filter((call) => call.key === 'GET /admin/services').at(-1)
    expect(lastServicesCall.body.params).toEqual(expect.objectContaining({ brandId: 1 }))
  })

  // BGSI-302: search box + status, the empty list and "Limpiar filtros"
  it('Clientes: searches, filters by status and clears the filters', async () => {
    const calls = fakeApi({
      'GET /admin/clients': (config) => page(config.params.q === 'nada' ? [] : [clientDto]),
    })
    const wrapper = await mountView(AdminClientsView)
    const lastParams = () => calls.filter((call) => call.key === 'GET /admin/clients').at(-1).body.params

    const search = wrapper.find('[data-test="filter-search"]')
    await search.setValue('nada')
    await search.trigger('keydown', { key: 'Enter' })
    await flushPromises()
    await wrapper.find('[data-test="filter-status"]').setValue(false)
    await flushPromises()

    expect(lastParams()).toEqual({ page: 0, size: 6, q: 'nada', active: false })
    expect(wrapper.find('[data-test="filter-no-results"]').text()).toContain('No hay clientes que coincidan')
    expect(wrapper.find('table').exists()).toBe(false)

    await wrapper.find('[data-test="filter-no-results"] button').trigger('click')
    await flushPromises()

    expect(lastParams()).toEqual({ page: 0, size: 6 })
    expect(wrapper.find('[data-test="filter-search"]').element.value).toBe('')
    expect(wrapper.find('[data-test="filter-clear"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Bar La Plaza')
  })

  it('Productos: the brand is one more filter and "Limpiar filtros" also removes it', async () => {
    const calls = fakeApi({
      'GET /admin/services': page([serviceDto]),
      'GET /admin/brands': page([brandDto]),
    })
    const wrapper = await mountView(AdminServicesView)
    const lastParams = () => calls.filter((call) => call.key === 'GET /admin/services').at(-1).body.params

    await wrapper.find('#brand-filter').setValue('1')
    await flushPromises()
    await wrapper.find('[data-test="filter-status"]').setValue(true)
    await flushPromises()
    expect(lastParams()).toEqual({ page: 0, size: 6, brandId: 1, active: true })

    await wrapper.find('[data-test="filter-clear"]').trigger('click')
    await flushPromises()

    expect(lastParams()).toEqual({ page: 0, size: 6 })
    expect(wrapper.find('#brand-filter').element.value).toBe('')
  })

  // BGSI-310: "Activar / Inactivar" from the "⋯" menu, with the real repositories (PATCH .../active)
  it('Productos: inactivates a product and shows the new state', async () => {
    let current = serviceDto
    const calls = fakeApi({
      'GET /admin/services': () => page([current]),
      'GET /admin/brands': page([brandDto]),
      'PATCH /admin/services/3/active': (body) => (current = { ...serviceDto, ...body }),
    })
    const wrapper = await mountView(AdminServicesView)
    expect(wrapper.find('[data-label="Estado"]').text()).toBe('Activo')

    await chooseRowAction(wrapper, 'Inactivar')
    await flushPromises()

    expect(calls.find((call) => call.key === 'PATCH /admin/services/3/active').body).toEqual({ active: false })
    expect(wrapper.find('[role="status"]').text()).toBe('Producto BDP One inactivado: ya no se ve en la web.')
    expect(wrapper.find('[data-label="Estado"]').text()).toBe('Inactivo')
  })

  it('Clientes: activates a hidden client', async () => {
    const calls = fakeApi({
      'GET /admin/clients': page([{ ...clientDto, published: false }]),
      'PATCH /admin/clients/2/active': (body) => ({ ...clientDto, published: body.active }),
    })
    const wrapper = await mountView(AdminClientsView)

    await chooseRowAction(wrapper, 'Activar')
    await flushPromises()

    expect(calls.find((call) => call.key === 'PATCH /admin/clients/2/active').body).toEqual({ active: true })
    expect(wrapper.find('[role="status"]').text()).toBe('Cliente Bar La Plaza activado: vuelve a verse en la web.')
  })

  it('Marcas: inactivating a brand explains that its products are hidden too', async () => {
    fakeApi({
      'GET /admin/brands': page([brandDto]),
      'PATCH /admin/brands/1/active': (body) => ({ ...brandDto, ...body }),
    })
    const wrapper = await mountView(AdminBrandsView)

    await chooseRowAction(wrapper, 'Inactivar')
    await flushPromises()

    expect(wrapper.find('[role="status"]').text()).toBe('Marca BDP inactivada: ni ella ni sus productos se ven en la web.')
  })

  it('shows the error of the backend when the state cannot be changed', async () => {
    fakeApi({ 'GET /admin/clients': page([clientDto]) })
    const wrapper = await mountView(AdminClientsView)

    await chooseRowAction(wrapper, 'Inactivar')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toContain('Not mocked: PATCH /admin/clients/2/active')
  })

  // BGSI-316: 6 per page in Clientes, Marcas and Productos
  it.each([
    ['Clientes', AdminClientsView, 'GET /admin/clients'],
    ['Marcas', AdminBrandsView, 'GET /admin/brands'],
    ['Productos', AdminServicesView, 'GET /admin/services'],
  ])('%s asks for 6 per page', async (_, view, route) => {
    const calls = fakeApi({ [route]: page([]), 'GET /admin/brands': page([]) })
    await mountView(view)

    expect(calls.find((call) => call.key === route).body.params).toEqual(expect.objectContaining({ page: 0, size: 6 }))
  })

  it('shows the error of the backend when the list cannot be loaded', async () => {
    fakeApi({})
    const wrapper = await mountView(AdminClientsView)

    expect(wrapper.find('[role="alert"]').text()).toContain('Not mocked')
  })
})
