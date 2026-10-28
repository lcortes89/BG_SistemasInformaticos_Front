import { describe, it, expect, vi, afterEach } from 'vitest'
import { saveFile } from '@/core/utils/save-file'

describe('saveFile', () => {
  afterEach(() => vi.restoreAllMocks())

  it('clicks a temporary link with the file name and frees the memory', () => {
    URL.createObjectURL = vi.fn(() => 'blob:fake')
    URL.revokeObjectURL = vi.fn()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    saveFile(new Blob(['x']), 'marcas-2026-10-05.xlsx')

    const link = click.mock.contexts[0]
    expect(link.download).toBe('marcas-2026-10-05.xlsx')
    expect(link.href).toBe('blob:fake')
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:fake')
    expect(document.querySelector('a[download]')).toBeNull()
  })
})
