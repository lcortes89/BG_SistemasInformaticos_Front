import { describe, it, expect } from 'vitest'
import { isElementPassed } from '@/composables/layout/useElementPassed'

describe('isElementPassed (BGSI-247)', () => {
  it('is false while part of the element is still on screen', () => {
    expect(isElementPassed(300)).toBe(false)
    expect(isElementPassed(100, 72)).toBe(false)
  })

  it('is true once the element has gone up, under the header', () => {
    expect(isElementPassed(-10)).toBe(true)
    expect(isElementPassed(50, 72)).toBe(true)
  })
})
