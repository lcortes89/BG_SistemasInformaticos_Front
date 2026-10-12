import { describe, it, expect, vi } from 'vitest'
import RateService from '@/core/apis/rate/RateService'
import RateQuoteModel from '@/core/models/rate/RateQuoteModel'

const ANSWERS = {
  businessType: 'RESTAURANT', locations: 'TWO_THREE', posCount: 'TWO_THREE',
  space: 'WITH_TERRACE', squareMeters: 'MEDIUM',
}

describe('RateService', () => {
  it('sends the 5 answers and returns a RateQuoteModel', async () => {
    const repo = {
      calculate: vi.fn().mockResolvedValue({ monthlyPrice: 123.2, basePrice: 49, factor: 1.8, additions: 35 }),
    }

    const quote = await new RateService(repo).calculate(ANSWERS)

    expect(repo.calculate).toHaveBeenCalledWith(ANSWERS)
    expect(quote).toBeInstanceOf(RateQuoteModel)
    expect(quote.monthlyPrice).toBe(123.2)
  })

  it('turns missing values into 0', async () => {
    const quote = await new RateService({ calculate: vi.fn().mockResolvedValue({}) }).calculate(ANSWERS)

    expect(quote.monthlyPrice).toBe(0)
    expect(quote.additions).toBe(0)
  })
})

describe('RateQuoteModel', () => {
  it('formats the price in euros with Spanish format', () => {
    const quote = new RateQuoteModel(123.2, 49, 1.8, 35)

    // Intl uses a non-breaking space before €, so we normalise it
    expect(quote.getFormattedPrice().replace(/\s/g, ' ')).toBe('123,20 €')
  })
})
