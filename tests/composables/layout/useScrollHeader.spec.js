import { describe, it, expect } from 'vitest'
import { createScrollState } from '@/composables/layout/useScrollHeader'

describe('createScrollState (smart header)', () => {
  it('is normal at the top of the page', () => {
    const state = createScrollState()

    state.update(0)

    expect(state.isTranslucent.value).toBe(false)
    expect(state.isHidden.value).toBe(false)
  })

  it('becomes translucent as soon as the page scrolls a little', () => {
    const state = createScrollState()

    state.update(50)

    expect(state.isTranslucent.value).toBe(true)
    expect(state.isHidden.value).toBe(false)
  })

  it('hides when scrolling down past 200px', () => {
    const state = createScrollState()

    state.update(150)
    state.update(400)

    expect(state.isHidden.value).toBe(true)
  })

  it('comes back as soon as the user scrolls up', () => {
    const state = createScrollState()

    state.update(400)
    state.update(600)
    state.update(580)

    expect(state.isHidden.value).toBe(false)
    expect(state.isTranslucent.value).toBe(true)
  })

  it('snaps back without animation when jumping to the top of the page', () => {
    const state = createScrollState()

    state.update(1500)
    expect(state.isAtTop.value).toBe(false)

    state.update(0)

    expect(state.isAtTop.value).toBe(true)
    expect(state.isHidden.value).toBe(false)
  })
})
