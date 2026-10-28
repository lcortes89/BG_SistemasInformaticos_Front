import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { fakeApi, page } from '../../helpers/fake-api'
import { routes } from '@/router/routes'
import SolutionsView from '@/views/public/SolutionsView.vue'
import ClientsView from '@/views/public/ClientsView.vue'
import ContactView from '@/views/public/ContactView.vue'

// BGSI-266: the public pages with a fake backend
const brandDto = { id: 1, name: 'BDP', description: 'TPV', category: 'Software', logoUrl: null, active: true, serviceCount: 2 }
const serviceDto = { id: 3, name: 'BDP One', description: 'TPV', imageUrl: null, featured: true, brandId: 1, brandName: 'BDP' }
const clientDto = { id: 2, name: 'Bar La Plaza', businessType: 'Bar', testimonial: 'Great', logoUrl: null, rating: 5, published: true }

async function mountAt(view, path) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  const wrapper = mount(view, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

describe('public views', () => {
  beforeEach(() => {
    // jsdom does not scroll
    Element.prototype.scrollIntoView = vi.fn()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('Soluciones: shows the brands and the products of the chosen brand', async () => {
    const calls = fakeApi({
      'GET /brands': [brandDto],
      'GET /brands/1/services': page([serviceDto]),
    })
    const wrapper = await mountAt(SolutionsView, '/soluciones')
    expect(wrapper.text()).toContain('Elige una marca para ver sus productos.')

    await wrapper.find('.brand-card__button').trigger('click')
    await flushPromises()

    expect(calls.map((call) => call.key)).toContain('GET /brands/1/services')
    expect(wrapper.text()).toContain('BDP One')
  })

  it('Soluciones: shows the error when the brands do not load', async () => {
    fakeApi({})
    const wrapper = await mountAt(SolutionsView, '/soluciones')

    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('Soluciones: shows a message when there are no brands', async () => {
    fakeApi({ 'GET /brands': [] })
    const wrapper = await mountAt(SolutionsView, '/soluciones')

    expect(wrapper.text()).toContain('No hay soluciones disponibles en este momento.')
  })

  it('Clientes: shows the published clients', async () => {
    fakeApi({ 'GET /clients': page([clientDto]) })
    const wrapper = await mountAt(ClientsView, '/clientes')

    expect(wrapper.text()).toContain('Bar La Plaza')
  })

  it('Clientes: shows a message when there are no clients', async () => {
    fakeApi({ 'GET /clients': page([]) })
    const wrapper = await mountAt(ClientsView, '/clientes')

    expect(wrapper.text()).toContain('Aún no hay casos de éxito publicados.')
  })

  it('Contacto: ?producto= chooses the product and writes the message', async () => {
    fakeApi({ 'GET /services': [serviceDto] })
    const wrapper = await mountAt(ContactView, '/contacto?producto=BDP One')

    expect(wrapper.find('#contact-service').element.value).toBe('BDP One')
    expect(wrapper.find('textarea').element.value).toBe('Hola, me gustaría recibir información sobre BDP One.')
  })

  it('Contacto: ?interes=demo writes the demo message', async () => {
    fakeApi({ 'GET /services': [serviceDto] })
    const wrapper = await mountAt(ContactView, '/contacto?interes=demo')

    expect(wrapper.find('textarea').element.value).toBe('Hola, me gustaría solicitar una demo de vuestros sistemas.')
  })
})
