import { describe, it, expect, vi } from 'vitest'
import { useAdminRateRules } from '@/composables/admin/useAdminRateRules'
import RateRuleModel from '@/core/models/rate/RateRuleModel'

const newRule = () => new RateRuleModel(1, 'BUSINESS_TYPE', 'RESTAURANT', 'Restaurante', 49, 'BASE')

describe('useAdminRateRules', () => {
  it('loads the blocks', async () => {
    const service = { getGroups: vi.fn().mockResolvedValue([{ category: 'BUSINESS_TYPE', rules: [] }]) }
    const { groups, isLoading, load } = useAdminRateRules(service)

    await load()

    expect(groups.value).toHaveLength(1)
    expect(isLoading.value).toBe(false)
  })

  it('saves a valid amount and updates the rule', async () => {
    const rule = newRule()
    const service = { updateAmount: vi.fn().mockResolvedValue({ amount: 55 }) }
    const { feedback, save } = useAdminRateRules(service)

    await save(rule, '55')

    expect(service.updateAmount).toHaveBeenCalledWith(1, '55')
    expect(rule.amount).toBe(55)
    expect(feedback.value).toBe('Restaurante: precio guardado')
  })

  it('does not call the API when the amount is not valid', async () => {
    const service = { updateAmount: vi.fn() }
    const { rowErrors, save } = useAdminRateRules(service)

    await save(newRule(), '-1')

    expect(service.updateAmount).not.toHaveBeenCalled()
    expect(rowErrors[1]).toBe('No puede ser negativo')
  })

  it('shows the backend error next to the rule', async () => {
    const service = { updateAmount: vi.fn().mockRejectedValue(new Error('No tienes permiso para realizar esta acción.')) }
    const { rowErrors, save } = useAdminRateRules(service)

    await save(newRule(), '60')

    expect(rowErrors[1]).toBe('No tienes permiso para realizar esta acción.')
  })
})
