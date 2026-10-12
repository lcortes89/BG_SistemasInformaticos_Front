import { describe, it, expect, vi } from 'vitest'
import AdminClientService from '@/core/apis/client/AdminClientService'
import ClientModel from '@/core/models/client/ClientModel'

const clientDto = { id: 1, name: 'Bar La Plaza', businessType: 'Bar', testimonial: 'Great', logoUrl: null, rating: 5, published: false }

describe('AdminClientService', () => {
  it('returns the clients of the page including the published flag', async () => {
    const repo = { findPage: vi.fn().mockResolvedValue({ content: [clientDto], page: 0, totalPages: 1, totalElements: 1 }) }

    const result = await new AdminClientService(repo).getPage(0, 10)

    expect(repo.findPage).toHaveBeenCalledWith(0, 10)
    expect(result.items[0]).toBeInstanceOf(ClientModel)
    expect(result.items[0].published).toBe(false)
  })

  it('sends a clean body with the rating as a number', async () => {
    const repo = { create: vi.fn().mockResolvedValue(clientDto) }
    const form = { name: ' Bar La Plaza ', businessType: 'Bar', testimonial: ' Great ', logoUrl: '', rating: '4', published: true }

    await new AdminClientService(repo).create(form)

    expect(repo.create).toHaveBeenCalledWith({
      name: 'Bar La Plaza', businessType: 'Bar', testimonial: 'Great', logoUrl: null, rating: 4, published: true,
    })
  })
})
