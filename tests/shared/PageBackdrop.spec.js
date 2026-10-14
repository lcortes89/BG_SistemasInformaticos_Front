import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageBackdrop from '@/shared/PageBackdrop.vue'

describe('PageBackdrop (BGSI-227)', () => {
  it('renders the content of the view over the photo', () => {
    const wrapper = mount(PageBackdrop, { slots: { default: '<h1>Nuestros Clientes</h1>' } })

    expect(wrapper.find('.page-backdrop__content h1').text()).toBe('Nuestros Clientes')
    expect(wrapper.find('.page-backdrop__image').attributes('aria-hidden')).toBe('true')
  })

  it('uses the photo it receives instead of the default one', () => {
    const wrapper = mount(PageBackdrop, { props: { image: '/fotos/otra.jpg' } })

    expect(wrapper.find('.page-backdrop__image').attributes('style')).toContain('/fotos/otra.jpg')
  })
})
