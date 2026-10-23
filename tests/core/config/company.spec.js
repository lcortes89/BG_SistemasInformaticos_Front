import { describe, it, expect } from 'vitest'
import { COMPANY } from '@/core/config/company'
import { OFFICE } from '@/core/config/office'

// BGSI-321: the data of the owner, used by the legal pages and the contact form
describe('COMPANY', () => {
  it('has the trade name, the address of the office (the one of the map) and the website', () => {
    expect(COMPANY.name).toBe('BG Sistemas Informáticos')
    expect(COMPANY.address).toBe(`${OFFICE.address}, España`)
    expect(COMPANY.website).toBe('consultoriass.es')
  })
})
