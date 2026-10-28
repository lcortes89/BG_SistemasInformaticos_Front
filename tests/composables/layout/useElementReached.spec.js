import { describe, it, expect } from 'vitest'
import { isElementReached } from '@/composables/layout/useElementReached'

describe('isElementReached (BGSI-236)', () => {
  it('is false while the element is still below the screen', () => {
    expect(isElementReached(1500, 800)).toBe(false)
  })

  it('is true when the element enters the screen', () => {
    expect(isElementReached(600, 800)).toBe(true)
  })

  it('stays true when the element is already above the screen', () => {
    expect(isElementReached(-300, 800)).toBe(true)
  })
})
