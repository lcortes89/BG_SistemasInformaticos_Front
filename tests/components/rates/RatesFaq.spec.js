import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RatesFaq from '@/components/rates/RatesFaq.vue'

const items = [
  { id: 'a', question: '¿Pregunta A?', answer: 'Respuesta A' },
  { id: 'b', question: '¿Pregunta B?', answer: 'Respuesta B' },
]

const questions = (wrapper) => wrapper.findAll('.faq__question')
const panel = (wrapper, id) => wrapper.find(`#faq-answer-${id}`)

describe('RatesFaq', () => {
  it('shows every question with all the answers closed', () => {
    const wrapper = mount(RatesFaq, { props: { items } })

    expect(wrapper.text()).toContain('Preguntas sobre la contratación y tarifas')
    expect(questions(wrapper)).toHaveLength(2)
    expect(panel(wrapper, 'a').classes()).not.toContain('is-open')
    expect(panel(wrapper, 'a').attributes('aria-hidden')).toBe('true')
    expect(questions(wrapper)[0].attributes('aria-expanded')).toBe('false')
  })

  it('opens one answer at a time', async () => {
    const wrapper = mount(RatesFaq, { props: { items } })

    await questions(wrapper)[0].trigger('click')
    expect(panel(wrapper, 'a').classes()).toContain('is-open')
    expect(panel(wrapper, 'a').attributes('aria-hidden')).toBe('false')
    expect(questions(wrapper)[0].attributes('aria-controls')).toBe('faq-answer-a')

    await questions(wrapper)[1].trigger('click')
    expect(panel(wrapper, 'a').classes()).not.toContain('is-open')
    expect(panel(wrapper, 'b').classes()).toContain('is-open')
  })

  it('closes the answer when the same question is clicked again', async () => {
    const wrapper = mount(RatesFaq, { props: { items } })

    await questions(wrapper)[0].trigger('click')
    await questions(wrapper)[0].trigger('click')

    expect(panel(wrapper, 'a').classes()).not.toContain('is-open')
    expect(questions(wrapper)[0].attributes('aria-expanded')).toBe('false')
  })
})
