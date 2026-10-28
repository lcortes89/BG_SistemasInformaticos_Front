import { describe, it, expect } from 'vitest'
import { buildRateSummary } from '@/core/models/rate/rate-summary'
import RateQuoteModel from '@/core/models/rate/RateQuoteModel'
import { RATE_STEPS } from '../../../fixtures/rate-steps'

// { questionId: optionId }: Restaurante, 2 o 3 locales, 2 o 3 TPV, terraza, 100-250 m²
const answers = { 1: 1, 2: 7, 3: 10, 4: 13, 5: 15 }
const quote = new RateQuoteModel(123.2, 49, 1.8, 35)

describe('buildRateSummary', () => {
  it('lists every answer with its label and the estimated price', () => {
    const summary = buildRateSummary(answers, quote, '', RATE_STEPS).replace(/\s/g, ' ')

    expect(summary).toContain('Solicitud desde la calculadora de tarifas')
    expect(summary).toContain('Negocio: Restaurante')
    expect(summary).toContain('Locales: 2 o 3 locales')
    expect(summary).toContain('Espacio: Interior + terraza')
    expect(summary).toContain('Superficie: Entre 100 y 250 m²')
    expect(summary).toContain('Precio estimado: 123,20 €/mes')
    expect(summary).not.toContain('Comentario')
  })

  it('adds the comment when there is one', () => {
    expect(buildRateSummary(answers, quote, '  Abrimos en marzo ', RATE_STEPS)).toContain('Comentario: Abrimos en marzo')
  })
})
