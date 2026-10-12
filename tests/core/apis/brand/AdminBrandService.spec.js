import { describe, it, expect, vi } from 'vitest'
import AdminBrandService from '@/core/apis/brand/AdminBrandService'
import BrandModel from '@/core/models/brand/BrandModel'

const brandDto = { id: 1, name: 'BDP', description: 'TPV', category: 'Software', logoUrl: null, active: false, serviceCount: 3 }

describe('AdminBrandService', () => {
  it('returns the brands of the page with the admin fields', async () => {
    const repo = { findPage: vi.fn().mockResolvedValue({ content: [brandDto], page: 0, totalPages: 1, totalElements: 1 }) }

    const result = await new AdminBrandService(repo).getPage(0, 10)

    expect(repo.findPage).toHaveBeenCalledWith(0, 10)
    expect(result.items[0]).toBeInstanceOf(BrandModel)
    expect(result.items[0].active).toBe(false)
    expect(result.items[0].serviceCount).toBe(3)
  })

  it('sends a clean body when creating', async () => {
    const repo = { create: vi.fn().mockResolvedValue(brandDto) }
    const form = { name: '  BDP ', category: 'Software ', description: '', logoUrl: '  ', active: true }

    await new AdminBrandService(repo).create(form)

    expect(repo.create).toHaveBeenCalledWith({
      name: 'BDP', category: 'Software', description: null, logoUrl: null, active: true,
    })
  })

  it('updates and removes by id', async () => {
    const repo = { update: vi.fn().mockResolvedValue(brandDto), remove: vi.fn().mockResolvedValue(undefined) }
    const service = new AdminBrandService(repo)

    await service.update(1, { name: 'BDP', category: 'Software', description: 'TPV', logoUrl: '', active: false })
    await service.remove(1)

    expect(repo.update).toHaveBeenCalledWith(1, expect.objectContaining({ active: false }))
    expect(repo.remove).toHaveBeenCalledWith(1)
  })
})
