import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import RateWizard from '@/components/rates/RateWizard.vue'
import RateQuoteModel from '@/core/models/rate/RateQuoteModel'
import { routes } from '@/router/routes'

function mountWizard(rateService) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(RateWizard, { props: { rateService }, global: { plugins: [router] } })
}

const nextButton = (wrapper) => wrapper.find('.wizard__next')

// Clicks the first card of the current step and then "Siguiente"
async function answerStep(wrapper) {
  await wrapper.find('.option').trigger('click')
  await nextButton(wrapper).trigger('click')
  await flushPromises()
}

describe('RateWizard', () => {
  it('shows step 1 with the 5 business types and "Siguiente" disabled', () => {
    const wrapper = mountWizard({ calculate: vi.fn() })

    expect(wrapper.text()).toContain('Paso 1 de 5')
    expect(wrapper.text()).toContain('¿Qué tipo de negocio tienes?')
    expect(wrapper.findAll('.option')).toHaveLength(5)
    expect(nextButton(wrapper).attributes('disabled')).toBeDefined()
    expect(wrapper.find('.wizard__back').exists()).toBe(false)
  })

  it('goes to step 2 and back keeping the answer', async () => {
    const wrapper = mountWizard({ calculate: vi.fn() })

    await answerStep(wrapper)
    expect(wrapper.text()).toContain('Paso 2 de 5')

    await wrapper.find('.wizard__back').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Paso 1 de 5')
    expect(wrapper.find('.option.is-selected').text()).toContain('Restaurante')
  })

  it('shows the price and the proposal button after the 5 steps', async () => {
    const service = { calculate: vi.fn().mockResolvedValue(new RateQuoteModel(123.2, 49, 1.8, 35)) }
    const wrapper = mountWizard(service)

    for (let i = 0; i < 5; i++) await answerStep(wrapper)

    expect(service.calculate).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('123,20')
    expect(wrapper.text()).toContain('Quiero esta propuesta')
  })
})
