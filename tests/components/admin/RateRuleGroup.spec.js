import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RateRuleGroup from '@/components/admin/RateRuleGroup.vue'
import RateRuleModel from '@/core/models/rate/RateRuleModel'

const group = {
  category: 'BUSINESS_TYPE',
  title: 'Tipo de negocio',
  rules: [new RateRuleModel(1, 'BUSINESS_TYPE', 'RESTAURANT', 'Restaurante', 49, 'BASE')],
}

describe('RateRuleGroup', () => {
  it('shows the block title, the rule and its current amount', () => {
    const wrapper = mount(RateRuleGroup, { props: { group } })

    expect(wrapper.text()).toContain('Tipo de negocio')
    expect(wrapper.text()).toContain('Restaurante')
    expect(wrapper.text()).toContain('Precio base')
    expect(wrapper.find('#rule-1').element.value).toBe('49')
  })

  it('enables "Guardar" only after a change and emits the new amount', async () => {
    const wrapper = mount(RateRuleGroup, { props: { group } })
    const button = wrapper.find('button[type="submit"]')

    expect(button.attributes('disabled')).toBeDefined()

    await wrapper.find('#rule-1').setValue('55')
    await wrapper.find('form').trigger('submit')

    expect(button.attributes('disabled')).toBeUndefined()
    const [rule, value] = wrapper.emitted('save')[0]
    expect(rule.id).toBe(1)
    expect(String(value)).toBe('55')
  })

  it('shows the error of a rule', () => {
    const wrapper = mount(RateRuleGroup, { props: { group, errors: { 1: 'No puede ser negativo' } } })

    expect(wrapper.find('[role="alert"]').text()).toBe('No puede ser negativo')
  })
})
