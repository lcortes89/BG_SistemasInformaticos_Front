import { describe, it, expect, vi } from 'vitest'
import RateService from '@/core/apis/rate/RateService'
import RateQuoteModel from '@/core/models/rate/RateQuoteModel'

// { questionId: optionId } chosen in the wizard (BGSI-235)
const ANSWERS = { 1: 1, 2: 7, 3: 10, 4: 13, 5: 15 }

describe('RateService', () => {
  it('sends the ids of the chosen options and returns a RateQuoteModel', async () => {
    const repo = {
      calculate: vi.fn().mockResolvedValue({ monthlyPrice: 123.2, basePrice: 49, factor: 1.8, additions: 35 }),
    }

    const quote = await new RateService(repo).calculate(ANSWERS)

    expect(repo.calculate).toHaveBeenCalledWith({ optionIds: [1, 7, 10, 13, 15] })
    expect(quote).toBeInstanceOf(RateQuoteModel)
    expect(quote.monthlyPrice).toBe(123.2)
  })

  it('turns missing values into 0', async () => {
    const quote = await new RateService({ calculate: vi.fn().mockResolvedValue({}) }).calculate(ANSWERS)

    expect(quote.monthlyPrice).toBe(0)
    expect(quote.additions).toBe(0)
  })
})

describe('RateService: steps (BGSI-235)', () => {
  it('maps the questions of the API to the steps of the wizard', async () => {
    const repo = {
      findSteps: vi.fn().mockResolvedValue([{
        id: 3, title: 'Negocio', question: '¿Qué negocio tienes?', hint: null,
        options: [{ id: 9, icon: '🍽️', label: 'Restaurante', description: null }],
      }]),
    }

    const steps = await new RateService(repo).getSteps()

    expect(steps).toEqual([{
      key: '3', title: 'Negocio', question: '¿Qué negocio tienes?', hint: '',
      options: [{ code: 9, icon: '🍽️', label: 'Restaurante', description: '' }],
    }])
  })
})

describe('RateQuoteModel', () => {
  it('formats the price in euros with Spanish format', () => {
    const quote = new RateQuoteModel(123.2, 49, 1.8, 35)

    // Intl uses a non-breaking space before €, so we normalise it
    expect(quote.getFormattedPrice().replace(/\s/g, ' ')).toBe('123,20 €')
  })
})
