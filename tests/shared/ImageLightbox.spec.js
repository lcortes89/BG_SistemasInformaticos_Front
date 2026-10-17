import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageLightbox from '@/shared/ImageLightbox.vue'

function mountLightbox() {
  return mount(ImageLightbox, {
    props: { src: 'http://x.com/bdp-one.png', alt: 'BDP One', caption: 'BDP One' },
    attachTo: document.body,
  })
}

describe('ImageLightbox (BGSI-265)', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('shows the big image with its name over the page', () => {
    const wrapper = mountLightbox()

    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog.querySelector('img').getAttribute('src')).toBe('http://x.com/bdp-one.png')
    expect(dialog.querySelector('figcaption').textContent).toBe('BDP One')
    wrapper.unmount()
  })

  it('closes with Escape, with the × button and with a click outside the image', async () => {
    const wrapper = mountLightbox()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    document.querySelector('.lightbox__close').click()
    document.querySelector('.lightbox').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector('.lightbox__image').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(wrapper.emitted('close')).toHaveLength(3) // the click on the image itself does not close it
    wrapper.unmount()
  })

  it('stops the page scroll while open and gives it back when closed', () => {
    const wrapper = mountLightbox()
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
