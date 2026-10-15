import { describe, it, expect, vi } from 'vitest'
import ExportService from '@/core/apis/export/ExportService'

const DATE = new Date(2026, 9, 5) // 5 Oct 2026

function fakeRepo() {
  return { findFile: vi.fn().mockResolvedValue(new Blob(['file'])) }
}

describe('ExportService', () => {
  it('asks the repository for the file and saves it with a dated name', async () => {
    const repo = fakeRepo()
    const save = vi.fn()

    const fileName = await new ExportService(repo, save).download('clients', 'pdf', {}, DATE)

    expect(repo.findFile).toHaveBeenCalledWith('clients', 'pdf', {})
    expect(fileName).toBe('clientes-2026-10-05.pdf')
    expect(save).toHaveBeenCalledWith(expect.any(Blob), 'clientes-2026-10-05.pdf')
  })

  it('sends the filters of the table, e.g. the brand of the products', async () => {
    const repo = fakeRepo()
    const save = vi.fn()

    await new ExportService(repo, save).download('services', 'xlsx', { brandId: 3 }, DATE)

    expect(repo.findFile).toHaveBeenCalledWith('services', 'xlsx', { brandId: 3 })
    expect(save).toHaveBeenCalledWith(expect.any(Blob), 'productos-2026-10-05.xlsx')
  })

  it('does not save anything when the download fails', async () => {
    const repo = { findFile: vi.fn().mockRejectedValue(new Error('Format must be pdf or xlsx')) }
    const save = vi.fn()

    await expect(new ExportService(repo, save).download('brands', 'doc')).rejects.toThrow('Format must be pdf or xlsx')
    expect(save).not.toHaveBeenCalled()
  })
})
