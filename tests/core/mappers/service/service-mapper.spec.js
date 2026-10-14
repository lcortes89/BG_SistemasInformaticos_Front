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

describe('serviceMapper: official page of the maker', () => {
  const form = { name: 'BDP One', brandId: '1', description: '', imageUrl: '', featured: false,
    longDescription: '', featuresText: '', sectorsText: '' }

  it('sends the link trimmed, or null when it is empty', () => {
    expect(serviceMapper.toRequest({ ...form, officialUrl: ' https://bdp.com ' }).officialUrl).toBe('https://bdp.com')
    expect(serviceMapper.toRequest({ ...form, officialUrl: '' }).officialUrl).toBeNull()
  })

  it('reads the link from the backend, null when missing', () => {
    expect(serviceMapper.officialUrl({ officialUrl: 'https://bdp.com' })).toBe('https://bdp.com')
    expect(serviceMapper.officialUrl({})).toBeNull()
  })
})
