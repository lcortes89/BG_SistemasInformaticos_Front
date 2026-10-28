import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProductDetailCard from '@/components/solutions/ProductDetailCard.vue'
import { routes } from '@/router/routes'

const bdpOne = {
  id: 2,
  name: 'BDP One',
  brandName: 'BDP',
  description: 'Short text',
  longDescription: 'TPV for Windows and Android.',
  imageUrl: 'http://x.com/bdp-one.jpg',
  features: ['Orders at the table', 'Kitchen printers'],
  sectors: ['Bars', 'Restaurants'],
}

function mountCard(service) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(ProductDetailCard, { props: { service }, global: { plugins: [router] } })
}

describe('ProductDetailCard (BGSI-206)', () => {
  it('shows the image, the long description, what it does and the sectors', () => {
    const wrapper = mountCard(bdpOne)

    expect(wrapper.find('img').attributes('src')).toBe('http://x.com/bdp-one.jpg')
    expect(wrapper.text()).toContain('TPV for Windows and Android.')
    expect(wrapper.findAll('.product__features li')).toHaveLength(2)
    expect(wrapper.findAll('.product__sectors li').map((li) => li.text())).toEqual(['Bars', 'Restaurants'])
  })

  it('shows the initials when there is no image or it cannot be loaded', async () => {
    const withoutImage = mountCard({ ...bdpOne, name: 'BDP .Net', imageUrl: null })
    expect(withoutImage.find('.product__placeholder').text()).toBe('BN')

    const brokenImage = mountCard(bdpOne)
    await brokenImage.find('img').trigger('error')
    expect(brokenImage.find('.product__placeholder').exists()).toBe(true)
  })

  it('uses the short description and hides empty blocks when the sheet is not filled', () => {
    const wrapper = mountCard({ id: 3, name: 'X', brandName: 'B', description: 'Short text' })

    expect(wrapper.text()).toContain('Short text')
    expect(wrapper.text()).not.toContain('Qué hace')
    expect(wrapper.text()).not.toContain('Ideal para')
  })

  it('links to Contacto with the product already chosen (BGSI-207)', () => {
    const href = mountCard(bdpOne).find('a').attributes('href')

    expect(href).toBe('/contacto?producto=BDP+One')
  })
})

describe('ProductDetailCard: official page of the maker', () => {
  it('opens the official page in a new tab when there is one', () => {
    const link = mountCard({ ...bdpOne, officialUrl: 'https://www.bdp-software.com/bdp-one' }).find('.product__official')

    expect(link.attributes('href')).toBe('https://www.bdp-software.com/bdp-one')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
  })

  it('hides the link when the admin has not filled it in', () => {
    expect(mountCard(bdpOne).find('.product__official').exists()).toBe(false)
  })
})

describe('ProductDetailCard: bigger image (BGSI-265)', () => {
  function mountAttached(service) {
    const router = createRouter({ history: createMemoryHistory(), routes })
    return mount(ProductDetailCard, { props: { service }, global: { plugins: [router] }, attachTo: document.body })
  }

  it('opens the image big when you click on it and closes it with Escape', async () => {
    const wrapper = mountAttached(bdpOne)

    await wrapper.find('.product__zoom').trigger('click')
    expect(document.querySelector('.lightbox img').getAttribute('src')).toBe('http://x.com/bdp-one.jpg')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.lightbox')).toBeNull()
    expect(document.activeElement).toBe(wrapper.find('.product__zoom').element) // focus back on the image
    wrapper.unmount()
  })

  it('a product without image has nothing to make bigger', () => {
    const wrapper = mountCard({ ...bdpOne, imageUrl: null })

    expect(wrapper.find('.product__zoom').exists()).toBe(false)
  })
})
