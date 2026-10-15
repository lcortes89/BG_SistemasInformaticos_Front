import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import RateWizard from '@/components/rates/RateWizard.vue'
import RateQuoteModel from '@/core/models/rate/RateQuoteModel'
import { routes } from '@/router/routes'
import { RATE_STEPS } from '../../fixtures/rate-steps'

// The questions come from the API (BGSI-235): the fake service returns the fixture
async function mountWizard(rateService) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  const wrapper = mount(RateWizard, {
    props: { rateService: { getSteps: vi.fn().mockResolvedValue(RATE_STEPS), ...rateService } },
    global: { plugins: [router] },
  })
  await flushPromises()
  return wrapper
}

const nextButton = (wrapper) => wrapper.find('.wizard__next')

// Clicks the first card of the current step and then "Siguiente"
async function answerStep(wrapper) {
  await wrapper.find('.option').trigger('click')
  await nextButton(wrapper).trigger('click')
  await flushPromises()
}

describe('RateWizard', () => {
  it('shows step 1 with the 5 business types and "Siguiente" disabled', async () => {
    const wrapper = await mountWizard({ calculate: vi.fn() })

    expect(wrapper.text()).toContain('Paso 1 de 5')
    expect(wrapper.text()).toContain('¿Qué tipo de negocio tienes?')
    expect(wrapper.findAll('.option')).toHaveLength(5)
    expect(nextButton(wrapper).attributes('disabled')).toBeDefined()
    expect(wrapper.find('.wizard__back').exists()).toBe(false)
  })

  it('goes to step 2 and back keeping the answer', async () => {
    const wrapper = await mountWizard({ calculate: vi.fn() })

    await answerStep(wrapper)
    expect(wrapper.text()).toContain('Paso 2 de 5')

    await wrapper.find('.wizard__back').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Paso 1 de 5')
    expect(wrapper.find('.option.is-selected').text()).toContain('Restaurante')
  })

  it('shows the price and the proposal button after the 5 steps', async () => {
    const service = { calculate: vi.fn().mockResolvedValue(new RateQuoteModel(123.2, 49, 1.8, 35)) }
    const wrapper = await mountWizard(service)

    for (let i = 0; i < 5; i++) await answerStep(wrapper)

    expect(service.calculate).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('123,20')
    expect(wrapper.text()).toContain('Quiero esta propuesta')
  })
})

describe('RateWizard: questions from the API (BGSI-235)', () => {
  it('shows a message when there are no questions published', async () => {
    const wrapper = await mountWizard({ getSteps: vi.fn().mockResolvedValue([]), calculate: vi.fn() })

    expect(wrapper.text()).toContain('La calculadora no está disponible')
    expect(wrapper.find('.option').exists()).toBe(false)
  })

  it('shows the error when the questions cannot be loaded', async () => {
    const wrapper = await mountWizard({ getSteps: vi.fn().mockRejectedValue(new Error('Server down')), calculate: vi.fn() })

    expect(wrapper.find('[role="alert"]').text()).toBe('Server down')
  })
})
