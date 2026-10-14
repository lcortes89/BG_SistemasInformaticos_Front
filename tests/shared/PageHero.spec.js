import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHero from '@/shared/PageHero.vue'

describe('PageHero', () => {
  it('shows eyebrow, title and subtitle, without breadcrumb (BGSI-225)', () => {
    const wrapper = mount(PageHero, {
      props: { eyebrow: 'Casos reales', title: 'Nuestros Clientes', subtitle: 'Texto' },
    })

    expect(wrapper.find('.page-hero__eyebrow').text()).toBe('Casos reales')
    expect(wrapper.find('h1').text()).toBe('Nuestros Clientes')
    expect(wrapper.text()).toContain('Texto')
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('renders the extra content of the slot only when there is one', () => {
    expect(mount(PageHero, { props: { title: 'X' } }).find('.page-hero__extra').exists()).toBe(false)

    const wrapper = mount(PageHero, { props: { title: 'X' }, slots: { default: '<span class="badge">Sello</span>' } })
    expect(wrapper.find('.page-hero__extra .badge').text()).toBe('Sello')
  })

  it('can be centered', () => {
    expect(mount(PageHero, { props: { title: 'X', centered: true } }).classes()).toContain('page-hero--centered')
  })

  it('moves the spotlight to the cursor position', async () => {
    const wrapper = mount(PageHero, { props: { title: 'X' }, attachTo: document.body })

    await wrapper.trigger('mousemove', { clientX: 120, clientY: 40 })

    expect(wrapper.element.style.getPropertyValue('--spot-x')).toBe('120px')
    expect(wrapper.element.style.getPropertyValue('--spot-y')).toBe('40px')
    wrapper.unmount()
  })
})
