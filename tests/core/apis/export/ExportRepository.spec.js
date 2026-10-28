import { describe, it, expect, afterEach, vi } from 'vitest'
import { fakeApi } from '../../../helpers/fake-api'
import ExportRepository from '@/core/apis/export/ExportRepository'

// BGSI-302: the export sends the filters of the table, without the empty ones
describe('ExportRepository', () => {
  afterEach(() => vi.restoreAllMocks())

  it('asks for the file with the format and the filters that have a value', async () => {
    const calls = fakeApi({ 'GET /admin/clients/export': 'file' })

    await new ExportRepository().findFile('clients', 'pdf', { q: 'bar', active: false, brandId: null })

    expect(calls[0].body.params).toEqual({ format: 'pdf', q: 'bar', active: false })
    expect(calls[0].body.responseType).toBe('blob')
  })
})
