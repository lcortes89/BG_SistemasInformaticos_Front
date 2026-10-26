import { describe, it, expect } from 'vitest'
import { listParams, withoutEmpty } from '@/core/apis/base/list-params'

// BGSI-302: empty filters are not sent to the backend
describe('list params', () => {
  it('removes the empty filters but keeps false', () => {
    expect(withoutEmpty({ q: '', status: null, brandId: undefined, active: false })).toEqual({ active: false })
  })

  it('adds the page and the size', () => {
    expect(listParams(2, 6, { q: 'bar', active: null })).toEqual({ page: 2, size: 6, q: 'bar' })
  })
})
