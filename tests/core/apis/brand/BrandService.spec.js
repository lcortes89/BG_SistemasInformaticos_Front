import { describe, it, expect, vi } from 'vitest'
import BrandService from '@/core/apis/brand/BrandService'
import BrandModel from '@/core/models/brand/BrandModel'
import ServiceModel from '@/core/models/service/ServiceModel'

const fakeRepository = {
  findAll: vi.fn().mockResolvedValue([
    { id: 1, name: 'BDP', description: 'TPV', category: 'Software', logoUrl: null },
  ]),
  findServicesByBrand: vi.fn().mockResolvedValue({
    content: [{ id: 2, name: 'BDP One', description: 'Multiplatform', brandId: 1, brandName: 'BDP' }],
    page: 1, size: 4, totalElements: 6, totalPages: 2, last: true,
  }),
}

describe('BrandService', () => {
  it('returns the brands as BrandModel objects', async () => {
    const brands = await new BrandService(fakeRepository).getAll()

    expect(brands[0]).toBeInstanceOf(BrandModel)
    expect(brands[0].getInitials()).toBe('BD')
  })

  it('returns one page of services of a brand as ServiceModel objects (BGSI-248)', async () => {
    const result = await new BrandService(fakeRepository).getServices(1, 1, 4)

    expect(fakeRepository.findServicesByBrand).toHaveBeenCalledWith(1, 1, 4)
    expect(result.items[0]).toBeInstanceOf(ServiceModel)
    expect(result.items[0].name).toBe('BDP One')
    expect(result).toMatchObject({ page: 1, totalPages: 2, totalElements: 6 })
  })
})
