import { describe, it, expect, vi } from 'vitest'
import { useConfirmStep } from '@/composables/admin/useConfirmStep'

// BGSI-294: forms in two steps
describe('useConfirmStep', () => {
  it('starts in step 1 and goes to step 2 only when step 1 is valid', () => {
    let valid = false
    const { step, next } = useConfirmStep({ validateFirst: () => valid })

    expect(step.value).toBe(1)
    expect(next()).toBe(false)
    expect(step.value).toBe(1)

    valid = true
    expect(next()).toBe(true)
    expect(step.value).toBe(2)
  })

  it('goes back to step 1 and empties the repeated value', () => {
    const onBack = vi.fn()
    const { step, next, back } = useConfirmStep({ onBack })
    next()

    back()

    expect(step.value).toBe(1)
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('blocks paste, shows the notice and hides it when the step changes', () => {
    const { pasteBlocked, next, back, reset, blockPaste } = useConfirmStep()
    const event = new Event('paste', { cancelable: true })
    next()

    blockPaste(event)
    expect(event.defaultPrevented).toBe(true)
    expect(pasteBlocked.value).toBe(true)

    back()
    expect(pasteBlocked.value).toBe(false)

    next()
    blockPaste()
    reset()
    expect(pasteBlocked.value).toBe(false)
  })
})
