import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useIdleLogout } from '@/composables/admin/useIdleLogout'
import { LAST_ACTIVITY_KEY } from '@/core/config/session'

// BGSI-268: 60 s without activity in the tests, warning in the last 30 s
const TIMEOUT = 60_000
const WARNING = 30_000

function setup() {
  const onTimeout = vi.fn()
  const idle = useIdleLogout({ onTimeout, timeoutMs: TIMEOUT, warningMs: WARNING })
  idle.start()
  return { idle, onTimeout }
}

describe('useIdleLogout', () => {
  let idle

  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    idle?.stop()
    vi.useRealTimers()
  })

  it('shows the warning in the last 30 seconds and closes the session at the end', () => {
    const test = setup()
    idle = test.idle

    vi.advanceTimersByTime(29_000)
    expect(idle.isWarning.value).toBe(false)

    vi.advanceTimersByTime(2_000)
    expect(idle.isWarning.value).toBe(true)
    expect(idle.secondsLeft.value).toBe(29)

    vi.advanceTimersByTime(29_000)
    expect(test.onTimeout).toHaveBeenCalledOnce()
    expect(idle.isWarning.value).toBe(false)

    vi.advanceTimersByTime(10_000)
    expect(test.onTimeout).toHaveBeenCalledOnce() // it stops after closing
  })

  it('starts again with any activity of the admin', () => {
    const test = setup()
    idle = test.idle

    vi.advanceTimersByTime(45_000)
    expect(idle.isWarning.value).toBe(true)

    window.dispatchEvent(new Event('keydown'))
    expect(idle.isWarning.value).toBe(false)

    vi.advanceTimersByTime(45_000)
    expect(test.onTimeout).not.toHaveBeenCalled()
  })

  it('"Seguir conectada" (markActivity) hides the warning and starts again', () => {
    const test = setup()
    idle = test.idle
    vi.advanceTimersByTime(45_000)

    idle.markActivity()

    expect(idle.isWarning.value).toBe(false)
    vi.advanceTimersByTime(29_000)
    expect(idle.isWarning.value).toBe(false)
  })

  it('shares the activity with the other tabs through localStorage', () => {
    const test = setup()
    idle = test.idle
    vi.advanceTimersByTime(50_000)

    // Another tab writes its activity
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
    vi.advanceTimersByTime(1_000)

    expect(idle.isWarning.value).toBe(false)
    vi.advanceTimersByTime(25_000)
    expect(test.onTimeout).not.toHaveBeenCalled()
  })

  it('writes the activity at most once per second', () => {
    const test = setup()
    idle = test.idle
    const setItem = vi.spyOn(Storage.prototype, 'setItem')

    window.dispatchEvent(new Event('mousemove'))
    window.dispatchEvent(new Event('mousemove'))
    expect(setItem).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1_000)
    window.dispatchEvent(new Event('mousemove'))
    expect(setItem).toHaveBeenCalledOnce()
    setItem.mockRestore()
  })

  it('stops listening when it is stopped', () => {
    const test = setup()
    idle = test.idle
    idle.stop()

    vi.advanceTimersByTime(TIMEOUT * 2)

    expect(test.onTimeout).not.toHaveBeenCalled()
  })

  it('still works when localStorage is blocked', () => {
    const storage = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } }
    const onTimeout = vi.fn()
    idle = useIdleLogout({ onTimeout, timeoutMs: TIMEOUT, warningMs: WARNING, storage })
    idle.start()

    vi.advanceTimersByTime(TIMEOUT)

    expect(onTimeout).toHaveBeenCalledOnce()
  })
})
