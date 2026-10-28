import { describe, it, expect } from 'vitest'
import BaseRepository from '@/core/apis/base/BaseRepository'

// When a file download fails, the error body arrives as a Blob
describe('BaseRepository.readJson', () => {
  it('reads the backend error inside a Blob', async () => {
    const blob = new Blob([JSON.stringify({ message: 'Format must be pdf or xlsx' })], { type: 'application/json' })

    expect(await BaseRepository.readJson(blob)).toEqual({ message: 'Format must be pdf or xlsx' })
  })

  it('returns null when the Blob is not JSON', async () => {
    expect(await BaseRepository.readJson(new Blob(['%PDF-1.7']))).toBeNull()
  })
})
