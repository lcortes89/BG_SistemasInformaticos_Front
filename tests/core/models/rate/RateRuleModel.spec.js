import { describe, it, expect } from 'vitest'
import RateRuleModel from '@/core/models/rate/RateRuleModel'

const factor = new RateRuleModel(2, 'NUM_LOCATIONS', 'TWO_THREE', '2 o 3 locales', 1.8, 'FACTOR')
const addition = new RateRuleModel(3, 'TERRACE', 'WITH_TERRACE', 'Comedor + terraza', 10, 'ADDITION')

describe('RateRuleModel', () => {
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
})
