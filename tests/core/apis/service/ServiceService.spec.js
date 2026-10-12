import { describe, it, expect, vi } from 'vitest'
import ServiceService from '@/core/apis/service/ServiceService'
import ServiceModel from '@/core/models/service/ServiceModel'

describe('ServiceService', () => {
  it('converts the featured services JSON into ServiceModel objects', async () => {
    const fakeRepository = {
      findFeatured: vi.fn().mockResolvedValue([
        { id: 2, name: 'BDP One', description: 'Multiplatform', imageUrl: null, brandId: 1, brandName: 'BDP' },
      ]),
    }

    const result = await new ServiceService(fakeRepository).getFeatured()

    expect(fakeRepository.findFeatured).toHaveBeenCalled()
    expect(result).toHaveLength(1)
    expect(result[0]).toBeInstanceOf(ServiceModel)
    expect(result[0].brandName).toBe('BDP')
  })
})
