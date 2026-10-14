import { describe, it, expect } from 'vitest'
import { serviceMapper, linesToList } from '@/core/mappers/service/service-mapper'

describe('serviceMapper: full product sheet (BGSI-205)', () => {
  it('turns the "one per line" text into a clean list', () => {
    expect(linesToList('  Bares \n\nRestaurantes\n')).toEqual(['Bares', 'Restaurantes'])
    expect(linesToList()).toEqual([])
  })

  it('sends the sheet to the backend', () => {
    const body = serviceMapper.toRequest({
      name: ' BDP One ', brandId: '1', description: '', imageUrl: '', featured: false,
      longDescription: '  Long text ', featuresText: 'Orders\nKitchen', sectorsText: '',
    })

    expect(body).toMatchObject({ longDescription: 'Long text', features: ['Orders', 'Kitchen'], sectors: [] })
  })
})
