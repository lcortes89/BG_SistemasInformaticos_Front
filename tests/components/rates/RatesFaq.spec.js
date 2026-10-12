import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RatesFaq from '@/components/rates/RatesFaq.vue'

const items = [
  { id: 'a', question: '¿Pregunta A?', answer: 'Respuesta A' },
  { id: 'b', question: '¿Pregunta B?', answer: 'Respuesta B' },
]

const questions = (wrapper) => wrapper.findAll('.faq__question')

describe('RatesFaq', () => {
  it('shows every question with all the answers closed', () => {
    const wrapper = mount(RatesFaq, { props: { items } })

    expect(wrapper.text()).toContain('Preguntas sobre la contratación y tarifas')
    expect(questions(wrapper)).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Respuesta A')
    expect(questions(wrapper)[0].attributes('aria-expanded')).toBe('false')
  })

  it('opens one answer at a time', async () => {
    const wrapper = mount(RatesFaq, { props: { items } })

    await questions(wrapper)[0].trigger('click')
    expect(wrapper.text()).toContain('Respuesta A')
    expect(questions(wrapper)[0].attributes('aria-expanded')).toBe('true')
    expect(questions(wrapper)[0].attributes('aria-controls')).toBe('faq-answer-a')

    await questions(wrapper)[1].trigger('click')
    expect(wrapper.find('#faq-answer-a').exists()).toBe(false)
    expect(wrapper.text()).toContain('Respuesta B')
  })

  it('closes the answer when the same question is clicked again', async () => {
    const wrapper = mount(RatesFaq, { props: { items } })

    await questions(wrapper)[0].trigger('click')
    await questions(wrapper)[0].trigger('click')

    expect(wrapper.find('#faq-answer-a').exists()).toBe(false)
    expect(questions(wrapper)[0].attributes('aria-expanded')).toBe('false')
  })
})
