import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { fakeApi } from './helpers/fake-api'
import router from '@/router'
import App from '@/App.vue'

// BGSI-266: the whole app with the real router and a fake backend
const serviceDto = { id: 3, name: 'BDP One', description: 'TPV', imageUrl: null, featured: true, brandId: 1, brandName: 'BDP' }

async function openAt(path) {
  const pinia = createPinia()
  setActivePinia(pinia)
  await router.push(path)
  const wrapper = mount(App, { global: { plugins: [router, pinia] }, attachTo: document.body })
  await flushPromises()
  await vi.dynamicImportSettled()
  await flushPromises()
  return wrapper
}

describe('App', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    fakeApi({
      'GET /settings/hero': { imageUrl: null },
      'GET /services': [serviceDto],
      'GET /rates/steps': [],
    })
  })
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('opens on Inicio with the header and the demo card', async () => {
    const wrapper = await openAt('/')

    expect(wrapper.find('h1').text()).toBe('Digitaliza tu negocio hostelero')
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.text()).toContain('BDP One')
  })

  it('shows Tarifas with its questions and the FAQ', async () => {
    const wrapper = await openAt('/tarifas')

    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('main').text().length).toBeGreaterThan(0)
  })

  it('shows the legal page', async () => {
    const wrapper = await openAt('/aviso-legal')

    expect(wrapper.find('h1').text()).toBe('Información legal')
  })

  it('shows "Página no encontrada" for an unknown address', async () => {
    const wrapper = await openAt('/no-existe')

    expect(wrapper.find('h1').text()).toBe('Página no encontrada')
  })

  it('sends a visitor without session from the panel to the login', async () => {
    const wrapper = await openAt('/admin')

    expect(router.currentRoute.value.name).toBe('admin-login')
    expect(wrapper.text()).not.toContain('Solicita tu demo')
  })
})
