import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroPreview from '@/components/admin/HeroPreview.vue'

describe('HeroPreview (BGSI-230)', () => {
  it('shows the photo being chosen', () => {
    const wrapper = mount(HeroPreview, { props: { imageUrl: 'http://x.com/a.jpg' } })

    expect(wrapper.find('.hero-preview__image').attributes('style')).toContain('http://x.com/a.jpg')
  })

  it('falls back to the default photo when there is no URL', () => {
    const wrapper = mount(HeroPreview, { props: { imageUrl: '' } })

    expect(wrapper.find('.hero-preview__image').attributes('style')).toContain('hero')
  })
})
