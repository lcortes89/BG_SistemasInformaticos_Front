import { describe, it, expect, vi, afterEach } from 'vitest'
import { effectScope } from 'vue'
import { useMediaQuery } from '@/composables/layout/useMediaQuery'

// A fake window.matchMedia (jsdom does not have it) that can "change size"
function fakeMatchMedia(matches) {
  const listeners = new Set()
  const query = {
    matches,
    addEventListener: vi.fn((_type, listener) => listeners.add(listener)),
    removeEventListener: vi.fn((_type, listener) => listeners.delete(listener)),
    resize(nowMatches) {
      query.matches = nowMatches
      listeners.forEach((listener) => listener({ matches: nowMatches }))
    },
  }
  window.matchMedia = vi.fn().mockReturnValue(query)
  return query
}

// BGSI-330: true on phones (max-width: 560px), and it follows when the size changes
describe('useMediaQuery', () => {
  afterEach(() => { delete window.matchMedia })

  it('says if the query matches and follows the changes', () => {
    const query = fakeMatchMedia(true)
    const scope = effectScope()
    const isMobile = scope.run(() => useMediaQuery('(max-width: 560px)'))

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 560px)')
    expect(isMobile.value).toBe(true)

    query.resize(false)
    expect(isMobile.value).toBe(false)

    scope.stop()
    expect(query.removeEventListener).toHaveBeenCalled()
  })

  it('is false when the browser has no matchMedia', () => {
    delete window.matchMedia
    const scope = effectScope()

    expect(scope.run(() => useMediaQuery('(max-width: 560px)')).value).toBe(false)
    scope.stop()
  })
})
