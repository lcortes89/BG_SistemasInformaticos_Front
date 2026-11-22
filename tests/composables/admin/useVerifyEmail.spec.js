import { describe, it, expect, vi } from 'vitest'
import { useVerifyEmail } from '@/composables/admin/useVerifyEmail'

// BGSI-240: page of the link that verifies the email of a new admin
describe('useVerifyEmail', () => {
  it('without a token the link is not valid and nothing is sent', async () => {
    const service = { verifyEmail: vi.fn() }
    const page = useVerifyEmail('', service)

    await page.verify()

    expect(page.state.value).toBe('invalid')
    expect(service.verifyEmail).not.toHaveBeenCalled()
  })

  it('verifies the email with the token of the link', async () => {
    const service = { verifyEmail: vi.fn().mockResolvedValue() }
    const page = useVerifyEmail('abc', service)
    expect(page.state.value).toBe('loading')

    await page.verify()

    expect(service.verifyEmail).toHaveBeenCalledWith('abc')
    expect(page.state.value).toBe('done')
  })

  it.each([
    [{ status: 400 }, 'invalid'],
    [{ status: 500, message: 'Error del servidor' }, 'error'],
  ])('shows the state of the error %o', async (error, expected) => {
    const page = useVerifyEmail('abc', { verifyEmail: vi.fn().mockRejectedValue(error) })

    await page.verify()

    expect(page.state.value).toBe(expected)
    if (expected === 'error') expect(page.errorMessage.value).toBe('Error del servidor')
  })

  it('asks for a new link with the old token', async () => {
    const service = { resendVerification: vi.fn().mockResolvedValue() }
    const page = useVerifyEmail('abc', service)
    expect(page.resendState.value).toBe('idle')

    await page.resend()

    expect(service.resendVerification).toHaveBeenCalledWith('abc')
    expect(page.resendState.value).toBe('sent')
  })

  it('tells when the new link could not be asked', async () => {
    const page = useVerifyEmail('abc', { resendVerification: vi.fn().mockRejectedValue({ status: 500 }) })

    await page.resend()

    expect(page.resendState.value).toBe('error')
  })
})
