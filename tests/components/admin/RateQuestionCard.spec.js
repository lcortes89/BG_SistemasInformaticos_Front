import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RateQuestionCard from '@/components/admin/RateQuestionCard.vue'
import RateQuestionModel from '@/core/models/rate/RateQuestionModel'
import RateOptionModel from '@/core/models/rate/RateOptionModel'

const question = () => new RateQuestionModel(2, 'Locales', '¿Cuántos locales tienes?', '', 1, true, [
  new RateOptionModel(6, '🏠', '1 local', 'Un único establecimiento.', 1, 'FACTOR'),
  new RateOptionModel(7, '🏘️', '2 o 3 locales', '', 1.8, 'FACTOR'),
])

function mountCard(props = {}) {
  return mount(RateQuestionCard, { props: { question: question(), index: 1, total: 3, initiallyOpen: true, ...props } })
}

describe('RateQuestionCard (BGSI-234)', () => {
  it('shows the step, the question and its options', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('Paso 2 · Locales')
    expect(wrapper.text()).toContain('¿Cuántos locales tienes?')
    expect(wrapper.text()).toContain('2 opciones')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('enables "Guardar" only when the price changes and sends the new price', async () => {
    const wrapper = mountCard()
    const save = wrapper.findAll('.question__save')[1]
    expect(save.attributes('disabled')).toBeDefined()

    await wrapper.findAll('tbody input')[1].setValue('2')
    await save.trigger('click')

    const [option, draft] = wrapper.emitted('save-price')[0]
    expect(option.id).toBe(7)
    expect(draft).toEqual({ adjustmentType: 'FACTOR', amount: 2 })
  })

  it('asks the page to move, hide, edit and delete', async () => {
    const wrapper = mountCard()

    await wrapper.find('[aria-label="Bajar pregunta"]').trigger('click')
    await wrapper.find('[role="switch"]').trigger('change')
    await wrapper.find('[aria-label="Borrar 1 local"]').trigger('click')
    await wrapper.find('.question__add').trigger('click')

    expect(wrapper.emitted('move')[0]).toEqual([1])
    expect(wrapper.emitted('toggle-active')).toHaveLength(1)
    expect(wrapper.emitted('delete-option')[0][0].id).toBe(6)
    expect(wrapper.emitted('add-option')).toHaveLength(1)
  })

  it('cannot move the last question down and starts closed when asked', () => {
    const wrapper = mountCard({ index: 2, initiallyOpen: false })

    expect(wrapper.find('[aria-label="Bajar pregunta"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('table').exists()).toBe(false)
  })
})
