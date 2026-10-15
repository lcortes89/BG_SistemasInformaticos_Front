import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RateQuestionForm from '@/components/admin/RateQuestionForm.vue'

describe('RateQuestionForm (BGSI-234)', () => {
  it('requires the step name and the question', async () => {
    const wrapper = mount(RateQuestionForm)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('El nombre del paso es obligatorio')
    expect(wrapper.text()).toContain('La pregunta es obligatoria')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('creates visible questions by default', async () => {
    const wrapper = mount(RateQuestionForm)
    await wrapper.find('#question-title').setValue('Carta')
    await wrapper.find('#question-text').setValue('¿Tienes carta digital?')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0]).toMatchObject({ title: 'Carta', active: true })
  })
})
