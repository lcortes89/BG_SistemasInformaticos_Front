import { describe, it, expect } from 'vitest'
import RateOptionModel from '@/core/models/rate/RateOptionModel'
import RateQuestionModel from '@/core/models/rate/RateQuestionModel'

const factor = new RateOptionModel(7, '🏘️', '2 o 3 locales', '', 1.8, 'FACTOR')
const addition = new RateOptionModel(13, '⛱️', 'Interior + terraza', '', 10, 'ADDITION')

describe('RateOptionModel (BGSI-234)', () => {
  it('describes its type and unit', () => {
    expect(factor.getTypeLabel()).toBe('Multiplica')
    expect(factor.getUnit()).toBe('×')
    expect(addition.getTypeLabel()).toBe('Suma')
    expect(addition.getUnit()).toBe('€')
  })

  it('validates the amount like the backend', () => {
    expect(addition.validate('')).toBe('El importe es obligatorio')
    expect(addition.validate('-5')).toBe('No puede ser negativo')
    expect(addition.validate('10.555')).toBe('Máximo 2 decimales')
    expect(addition.validate('0')).toBeNull()
    expect(factor.validate('0')).toBe('Un multiplicador debe ser mayor que 0')
    expect(factor.validate('2.25')).toBeNull()
  })

  it('validates with the type chosen in the form, not the saved one', () => {
    expect(RateOptionModel.validateAmount('0', 'FACTOR')).toBe('Un multiplicador debe ser mayor que 0')
    expect(RateOptionModel.validateAmount('0', 'ADDITION')).toBeNull()
  })
})

describe('RateQuestionModel (BGSI-234)', () => {
  it('says how many options it has', () => {
    expect(new RateQuestionModel(1, 'Espacio', '¿Cómo es tu espacio?', '', 0, true, [addition]).getOptionsLabel())
      .toBe('1 opción')
    expect(new RateQuestionModel(2, 'Locales', '¿Cuántos?', '', 1, true, [factor, addition]).getOptionsLabel())
      .toBe('2 opciones')
  })
})
