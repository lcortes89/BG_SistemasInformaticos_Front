import { describe, it, expect, vi } from 'vitest'
import { setupInterceptors } from '@/core/apis/base/http-interceptors'

// Fake axios instance that keeps the functions the interceptors register
function fakeHttp() {
  const handlers = {}
  return {
    handlers,
    interceptors: {
      request: { use: (onRequest) => { handlers.request = onRequest } },
      response: { use: (onSuccess, onError) => { handlers.error = onError } },
    },
  }
}

describe('setupInterceptors', () => {
  it('adds the Bearer token to the requests when there is a session', () => {
    const http = fakeHttp()
    setupInterceptors(http, { getToken: () => 'abc', onUnauthorized: vi.fn() })

    const config = http.handlers.request({ headers: {} })

    expect(config.headers.Authorization).toBe('Bearer abc')
  })

  it('does not add any header without a session', () => {
    const http = fakeHttp()
    setupInterceptors(http, { getToken: () => null, onUnauthorized: vi.fn() })

    const config = http.handlers.request({ headers: {} })

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('does not add the token to the login request (HTTP Basic)', () => {
    const http = fakeHttp()
    setupInterceptors(http, { getToken: () => 'old-token', onUnauthorized: vi.fn() })

    const config = http.handlers.request({ headers: {}, auth: { username: 'a@bg.es', password: 'x' } })

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('calls onUnauthorized when a request with our token gets a 401', async () => {
    const http = fakeHttp()
    const onUnauthorized = vi.fn()
    setupInterceptors(http, { getToken: () => 'abc', onUnauthorized })
    const error = { config: { headers: { Authorization: 'Bearer abc' } }, response: { status: 401 } }

    await expect(http.handlers.error(error)).rejects.toBe(error)
    expect(onUnauthorized).toHaveBeenCalled()
  })

  it('ignores the 401 of a failed login (wrong password, no Bearer token)', async () => {
    const http = fakeHttp()
    const onUnauthorized = vi.fn()
    setupInterceptors(http, { getToken: () => null, onUnauthorized })
    const error = { config: { headers: {} }, response: { status: 401 } }

    await expect(http.handlers.error(error)).rejects.toBe(error)
    expect(onUnauthorized).not.toHaveBeenCalled()
  })
})
