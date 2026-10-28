import { describe, it, expect, vi } from 'vitest'
import AdminServiceService from '@/core/apis/service/AdminServiceService'
import ServiceModel from '@/core/models/service/ServiceModel'

const serviceDto = { id: 2, name: 'BDP One', description: 'Multiplatform', imageUrl: null, featured: true, brandId: 1, brandName: 'BDP' }

describe('AdminServiceService', () => {
  it('passes the brand filter and returns ServiceModel objects', async () => {
    const repo = { findPage: vi.fn().mockResolvedValue({ content: [serviceDto], page: 0, totalPages: 1, totalElements: 1 }) }

    const result = await new AdminServiceService(repo).getPage(0, 10, { brandId: 1 })

    expect(repo.findPage).toHaveBeenCalledWith(0, 10, { brandId: 1, q: undefined, active: undefined })
    expect(result.items[0]).toBeInstanceOf(ServiceModel)
    expect(result.items[0].featured).toBe(true)
  })

  it('sends the brand id as a number when creating', async () => {
    const repo = { create: vi.fn().mockResolvedValue(serviceDto) }
    const form = { name: 'BDP One', brandId: '1', description: '', imageUrl: '', featured: true }

    await new AdminServiceService(repo).create(form)

    expect(repo.create).toHaveBeenCalledWith({
      name: 'BDP One', brandId: 1, description: null, imageUrl: null, featured: true,
      longDescription: null, features: [], sectors: [], officialUrl: null, active: true,
    })
  })

  it('activates or inactivates a product and returns it (BGSI-310)', async () => {
    const repo = { setActive: vi.fn().mockResolvedValue({ ...serviceDto, active: false }) }

    const result = await new AdminServiceService(repo).setActive(2, false)

    expect(repo.setActive).toHaveBeenCalledWith(2, false)
    expect(result).toBeInstanceOf(ServiceModel)
    expect(result.active).toBe(false)
  })
})
