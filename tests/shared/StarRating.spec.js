import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StarRating from '@/shared/StarRating.vue'

describe('StarRating', () => {
  it('fills as many stars as the rating and describes it for screen readers', () => {
    const wrapper = mount(StarRating, { props: { rating: 4 } })

    expect(wrapper.findAll('.stars__star--filled')).toHaveLength(4)
    expect(wrapper.findAll('.stars__star')).toHaveLength(5)
    expect(wrapper.attributes('aria-label')).toBe('Valoración: 4 de 5')
  })
})
