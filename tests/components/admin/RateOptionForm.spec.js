import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RateOptionForm from '@/components/admin/RateOptionForm.vue'
import RateOptionModel from '@/core/models/rate/RateOptionModel'

describe('RateOptionForm (BGSI-234)', () => {
  it('requires the label and a valid amount', async () => {
    const wrapper = mount(RateOptionForm)
    await wrapper.find('#option-type').setValue('FACTOR')
    await wrapper.find('#option-amount').setValue('0')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('El texto de la opción es obligatorio')
    expect(wrapper.text()).toContain('Un multiplicador debe ser mayor que 0')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('shows the option being edited and sends the changes', async () => {
    const option = new RateOptionModel(13, '⛱️', 'Interior + terraza', '', 10, 'ADDITION')
    const wrapper = mount(RateOptionForm, { props: { option } })
    expect(wrapper.find('#option-label').element.value).toBe('Interior + terraza')

    await wrapper.find('#option-amount').setValue('12.5')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0]).toMatchObject({ label: 'Interior + terraza', amount: 12.5, adjustmentType: 'ADDITION' })
  })
})
