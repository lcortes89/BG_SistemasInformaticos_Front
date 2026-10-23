import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from '@/router/routes'
import LegalView from '@/views/public/LegalView.vue'

// BGSI-321: the three legal pages share one view; the text comes from the route
async function mountAt(path) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push(path)
  await router.isReady()
  const wrapper = mount(LegalView, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

describe('LegalView', () => {
  it('Aviso legal: the owner of the website, with the address and the domain', async () => {
    const wrapper = await mountAt('/aviso-legal')

    expect(wrapper.find('h1').text()).toBe('Aviso legal')
    const owner = wrapper.find('#titular').text()
    expect(owner).toContain('BG Sistemas Informáticos')
    expect(owner).toContain('27700 Ribadeo (Lugo), España')
    expect(owner).toContain('consultoriass.es')
    expect(wrapper.text()).toContain('No se venden ni se contratan servicios online')
  })

  it('Política de privacidad: has every section the RGPD asks for, and the AEPD', async () => {
    const wrapper = await mountAt('/privacidad')

    expect(wrapper.find('h1').text()).toBe('Política de privacidad')
    expect(wrapper.findAll('section h2').map((h2) => h2.text())).toEqual([
      'Responsable del tratamiento', 'Qué datos recogemos', 'Para qué los usamos', 'Base legal',
      'Cuánto tiempo los guardamos', 'Quién más los ve', 'Si nos escribes por WhatsApp', 'Tus derechos', 'Seguridad',
    ])
    expect(wrapper.find('#derechos a[href="https://www.aepd.es"]').attributes('target')).toBe('_blank')
    expect(wrapper.find('#derechos a[href="/contacto"]').exists()).toBe(true)
  })

  it('Política de cookies: explains why there is no cookie banner', async () => {
    const wrapper = await mountAt('/cookies')

    expect(wrapper.find('h1').text()).toBe('Política de cookies')
    expect(wrapper.find('#banner').text()).toContain('la ley no exige pedir consentimiento')
    expect(wrapper.text()).toContain('OpenStreetMap')
  })

  it('has an index with a link to each section and links to the other legal texts', async () => {
    const wrapper = await mountAt('/cookies')
    const index = wrapper.find('nav[aria-label="Índice"]')

    expect(index.findAll('ol a').map((a) => a.attributes('href'))).toEqual(['#cuales', '#mapa', '#banner', '#borrar'])
    expect(index.findAll('ul a').map((a) => a.text())).toEqual(['Aviso legal', 'Política de privacidad'])
  })
})
