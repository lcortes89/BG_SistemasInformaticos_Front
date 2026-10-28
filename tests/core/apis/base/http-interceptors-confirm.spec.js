import { describe, it, expect, vi } from 'vitest'
import { setupInterceptors } from '@/core/apis/base/http-interceptors'

// Fake axios instance: it can be called to repeat a request, like the real one
function fakeHttp() {
  const handlers = {}
  const http = vi.fn().mockResolvedValue({ data: 'repeated' })
  http.handlers = handlers
  http.interceptors = {
    request: { use: (onRequest) => { handlers.request = onRequest } },
    response: { use: (onSuccess, onError) => { handlers.error = onError } },
  }
  return http
}

const confirmationRequired = () => ({
  config: { headers: { Authorization: 'Bearer abc' } },
  response: { status: 403, data: { details: { reason: 'CONFIRMATION_REQUIRED' } } },
})

// BGSI-275: X-Confirm-Token and the password dialog
describe('setupInterceptors: password confirmation (BGSI-275)', () => {
  it('sends the confirmation token while it is valid', () => {
    const http = fakeHttp()
    setupInterceptors(http, { getToken: () => 'abc', onUnauthorized: vi.fn(), getConfirmToken: () => 'tok' })

    const config = http.handlers.request({ headers: {} })

    expect(config.headers['X-Confirm-Token']).toBe('tok')
  })

  it('does not send it without a session or on the login request', () => {
    const http = fakeHttp()
    setupInterceptors(http, { getToken: () => null, onUnauthorized: vi.fn(), getConfirmToken: () => 'tok' })
    expect(http.handlers.request({ headers: {} }).headers['X-Confirm-Token']).toBeUndefined()

    const logged = fakeHttp()
    setupInterceptors(logged, { getToken: () => 'abc', onUnauthorized: vi.fn(), getConfirmToken: () => 'tok' })
    const login = logged.handlers.request({ headers: {}, auth: { username: 'a@bg.es', password: 'x' } })
    expect(login.headers['X-Confirm-Token']).toBeUndefined()
  })

  it('asks for the password and repeats the request once with the new token', async () => {
    const http = fakeHttp()
    const requestConfirmation = vi.fn().mockResolvedValue('new-tok')
    setupInterceptors(http, { getToken: () => 'abc', onUnauthorized: vi.fn(), requestConfirmation })

    const result = await http.handlers.error(confirmationRequired())

    expect(result).toEqual({ data: 'repeated' })
    expect(requestConfirmation).toHaveBeenCalledTimes(1)
    const repeated = http.mock.calls[0][0]
    expect(repeated.headers['X-Confirm-Token']).toBe('new-tok')
    expect(repeated.confirmRetried).toBe(true)
  })

  it('does not ask again if the repeated request is rejected too', async () => {
    const http = fakeHttp()
    const requestConfirmation = vi.fn()
    setupInterceptors(http, { getToken: () => 'abc', onUnauthorized: vi.fn(), requestConfirmation })
    const error = confirmationRequired()
    error.config.confirmRetried = true

    await expect(http.handlers.error(error)).rejects.toBe(error)
    expect(requestConfirmation).not.toHaveBeenCalled()
  })

  it('a cancelled dialog rejects with the cancelled error and repeats nothing', async () => {
    const http = fakeHttp()
    const cancelled = Object.assign(new Error('Acción cancelada'), { cancelled: true })
    setupInterceptors(http, {
      getToken: () => 'abc', onUnauthorized: vi.fn(), requestConfirmation: vi.fn().mockRejectedValue(cancelled),
    })

    await expect(http.handlers.error(confirmationRequired())).rejects.toBe(cancelled)
    expect(http).not.toHaveBeenCalled()
  })

  it('an ordinary 403 is not a confirmation', async () => {
    const http = fakeHttp()
    const requestConfirmation = vi.fn()
    setupInterceptors(http, { getToken: () => 'abc', onUnauthorized: vi.fn(), requestConfirmation })
    const error = { config: { headers: {} }, response: { status: 403, data: { details: null } } }

    await expect(http.handlers.error(error)).rejects.toBe(error)
    expect(requestConfirmation).not.toHaveBeenCalled()
  })
})
