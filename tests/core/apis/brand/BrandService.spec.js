import { describe, it, expect, vi } from 'vitest'
import BrandService from '@/core/apis/brand/BrandService'
import BrandModel from '@/core/models/brand/BrandModel'
import ServiceModel from '@/core/models/service/ServiceModel'

const fakeRepository = {
  findAll: vi.fn().mockResolvedValue([
    { id: 1, name: 'BDP', description: 'TPV', category: 'Software', logoUrl: null },
  ]),
  findServicesByBrand: vi.fn().mockResolvedValue([
    { id: 2, name: 'BDP One', description: 'Multiplatform', brandId: 1, brandName: 'BDP' },
  ]),
}

describe('BrandService', () => {
  it('returns the brands as BrandModel objects', async () => {
    const brands = await new BrandService(fakeRepository).getAll()

    expect(brands[0]).toBeInstanceOf(BrandModel)
    expect(brands[0].getInitials()).toBe('BD')
  })

  it('returns the services of a brand as ServiceModel objects', async () => {
    const services = await new BrandService(fakeRepository).getServices(1)

    expect(fakeRepository.findServicesByBrand).toHaveBeenCalledWith(1)
    expect(services[0]).toBeInstanceOf(ServiceModel)
    expect(services[0].name).toBe('BDP One')
  })
})
