import { describe, it, expect, vi } from 'vitest'
import { useAdminSummary } from '@/composables/admin/useAdminSummary'

describe('useAdminSummary', () => {
  it('starts with an empty summary and loads it', async () => {
    const service = { get: vi.fn().mockResolvedValue({ newContacts: 7, latestContacts: [] }) }
    const { summary, isLoading, load } = useAdminSummary(service)

    expect(summary.value.newContacts).toBe(0)

    await load()

    expect(summary.value.newContacts).toBe(7)
    expect(isLoading.value).toBe(false)
  })

  it('stores the error when the API fails', async () => {
    const service = { get: vi.fn().mockRejectedValue(new Error('Ha ocurrido un error en el servidor. Inténtalo más tarde.')) }
    const { error, load } = useAdminSummary(service)

    await load()

    expect(error.value).toBe('Ha ocurrido un error en el servidor. Inténtalo más tarde.')
  })
})
