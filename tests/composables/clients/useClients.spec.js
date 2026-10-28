import { describe, it, expect, vi } from 'vitest'
import { useClients } from '@/composables/clients/useClients'

describe('useClients', () => {
  it('loads the requested page', async () => {
    const fakeService = {
      getPublished: vi.fn().mockResolvedValue({ items: [{ id: 7 }], page: 1, totalPages: 2, totalElements: 7 }),
    }
    const { clients, page, totalPages, isLoading, loadPage } = useClients(fakeService)

    await loadPage(1)

    expect(fakeService.getPublished).toHaveBeenCalledWith(1, 6)
    expect(clients.value).toHaveLength(1)
    expect(page.value).toBe(1)
    expect(totalPages.value).toBe(2)
    expect(isLoading.value).toBe(false)
  })

  it('stores the error when the API fails', async () => {
    const fakeService = { getPublished: vi.fn().mockRejectedValue(new Error('Server down')) }
    const { error, loadPage } = useClients(fakeService)

    await loadPage(0)

    expect(error.value).toBe('Server down')
  })
})
