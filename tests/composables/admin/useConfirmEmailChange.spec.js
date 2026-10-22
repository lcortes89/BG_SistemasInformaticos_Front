import { describe, it, expect, vi } from 'vitest'
import { useConfirmEmailChange } from '@/composables/admin/useConfirmEmailChange'

// BGSI-301: the page of the link sent to the new email
describe('useConfirmEmailChange', () => {
  it('without a token the link is not valid and nothing is sent', async () => {
    const service = { confirmEmailChange: vi.fn() }
    const state = useConfirmEmailChange('', service)

    await state.confirm()

    expect(state.state.value).toBe('invalid')
    expect(service.confirmEmailChange).not.toHaveBeenCalled()
  })

  it('confirms the change and logs out', async () => {
    const service = { confirmEmailChange: vi.fn().mockResolvedValue('new@bg.es') }
    const onConfirmed = vi.fn()
    const state = useConfirmEmailChange('abc', service, onConfirmed)
    expect(state.state.value).toBe('loading')

    await state.confirm()

    expect(service.confirmEmailChange).toHaveBeenCalledWith('abc')
    expect(state.state.value).toBe('done')
    expect(state.newEmail.value).toBe('new@bg.es')
    expect(onConfirmed).toHaveBeenCalledWith('new@bg.es')
  })

  it.each([
    [{ status: 400 }, 'invalid'],
    [{ status: 409 }, 'taken'],
    [{ status: 500, message: 'Error del servidor' }, 'error'],
  ])('shows the state of the error %o', async (error, expected) => {
    const onConfirmed = vi.fn()
    const state = useConfirmEmailChange('abc', { confirmEmailChange: vi.fn().mockRejectedValue(error) }, onConfirmed)

    await state.confirm()

    expect(state.state.value).toBe(expected)
    expect(onConfirmed).not.toHaveBeenCalled()
    if (expected === 'error') expect(state.errorMessage.value).toBe('Error del servidor')
  })
})
