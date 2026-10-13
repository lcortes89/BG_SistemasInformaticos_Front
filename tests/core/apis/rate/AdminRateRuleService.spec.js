import { describe, it, expect, vi } from 'vitest'
import AdminRateRuleService from '@/core/apis/rate/AdminRateRuleService'
import RateRuleModel from '@/core/models/rate/RateRuleModel'

const restaurant = { id: 1, category: 'BUSINESS_TYPE', optionCode: 'RESTAURANT', label: 'Restaurante', amount: 49, adjustmentType: 'BASE' }

describe('AdminRateRuleService', () => {
  it('returns the blocks with a Spanish title and RateRuleModel rules', async () => {
    const repo = { findAll: vi.fn().mockResolvedValue([{ category: 'BUSINESS_TYPE', rules: [restaurant] }]) }

    const groups = await new AdminRateRuleService(repo).getGroups()

    expect(groups[0].title).toBe('Tipo de negocio')
    expect(groups[0].rules[0]).toBeInstanceOf(RateRuleModel)
    expect(groups[0].rules[0].amount).toBe(49)
  })

  it('sends the new amount as a number', async () => {
    const repo = { updateAmount: vi.fn().mockResolvedValue({ ...restaurant, amount: 55 }) }

    const rule = await new AdminRateRuleService(repo).updateAmount(1, '55')

    expect(repo.updateAmount).toHaveBeenCalledWith(1, 55)
    expect(rule.amount).toBe(55)
  })
})
