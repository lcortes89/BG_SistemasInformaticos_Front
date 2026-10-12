import { describe, it, expect, vi } from 'vitest'
import ClientService from '@/core/apis/client/ClientService'
import ClientModel from '@/core/models/client/ClientModel'

describe('ClientService', () => {
  it('returns the clients of the page as ClientModel objects plus the pagination info', async () => {
    const fakeRepository = {
      findPublished: vi.fn().mockResolvedValue({
        content: [{ id: 1, name: 'Bar La Plaza', businessType: 'Bar', testimonial: 'Great', logoUrl: null, rating: 5 }],
        page: 0, size: 6, totalElements: 7, totalPages: 2, last: false,
      }),
    }

    const result = await new ClientService(fakeRepository).getPublished(0, 6)

    expect(fakeRepository.findPublished).toHaveBeenCalledWith(0, 6)
    expect(result.items[0]).toBeInstanceOf(ClientModel)
    expect(result.items[0].getInitials()).toBe('BL')
    expect(result.totalPages).toBe(2)
  })
})
