import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PageHero from '@/shared/PageHero.vue'
import { routes } from '@/router/routes'

function mountHero(props, slots = {}) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(PageHero, { props, slots, global: { plugins: [router] } })
}

describe('PageHero', () => {
  it('shows breadcrumb, eyebrow, title and subtitle', () => {
    const wrapper = mountHero({
      breadcrumb: 'Nuestros Clientes', eyebrow: 'Casos reales', title: 'Nuestros Clientes', subtitle: 'Texto',
    })

    const breadcrumb = wrapper.find('nav[aria-label="Migas de pan"]')
    expect(breadcrumb.find('a').attributes('href')).toBe('/')
    expect(breadcrumb.find('[aria-current="page"]').text()).toBe('Nuestros Clientes')
    expect(wrapper.find('.page-hero__eyebrow').text()).toBe('Casos reales')
    expect(wrapper.find('h1').text()).toBe('Nuestros Clientes')
    expect(wrapper.text()).toContain('Texto')
  })

  it('renders the extra content of the slot only when there is one', () => {
    expect(mountHero({ breadcrumb: 'X', title: 'X' }).find('.page-hero__extra').exists()).toBe(false)

    const wrapper = mountHero({ breadcrumb: 'X', title: 'X' }, { default: '<span class="badge">Sello</span>' })
    expect(wrapper.find('.page-hero__extra .badge').text()).toBe('Sello')
  })

  it('can be centered', () => {
    const wrapper = mountHero({ breadcrumb: 'X', title: 'X', centered: true })

    expect(wrapper.classes()).toContain('page-hero--centered')
  })
})

describe('PageHero transparent (BGSI-226)', () => {
  it('drops its own background and the warm light so the view background shows', () => {
    const wrapper = mount(PageHero, { props: { title: 'X', transparent: true } })

    expect(wrapper.classes()).toContain('page-hero--transparent')
    expect(wrapper.findAll('.page-hero__light')).toHaveLength(1)
  })
})
