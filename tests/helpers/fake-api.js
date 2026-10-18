import { vi } from 'vitest'
import { http } from '@/core/apis/base/BaseRepository'

// BGSI-266: replaces the real backend in the view tests. routes = { 'GET /admin/brands': data }
export function fakeApi(routes) {
  const calls = []
  for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
    vi.spyOn(http, method).mockImplementation(async (url, bodyOrConfig) => {
      const key = `${method.toUpperCase()} ${url}`
      calls.push({ key, body: bodyOrConfig })
      if (!(key in routes)) {
        const error = new Error(`Not mocked: ${key}`)
        error.response = { status: 404, data: { message: `Not mocked: ${key}` } }
        throw error
      }
      const answer = routes[key]
      return { data: typeof answer === 'function' ? answer(bodyOrConfig) : answer }
    })
  }
  return calls
}

export const page = (content) => ({ content, page: 0, totalPages: 1, totalElements: content.length })
