import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import RateResult from '@/components/rates/RateResult.vue'
import RateQuoteModel from '@/core/models/rate/RateQuoteModel'
import { routes } from '@/router/routes'
import { RATE_STEPS } from '../../fixtures/rate-steps'

const answers = { 1: 1, 2: 6, 3: 9, 4: 12, 5: 14 }

function mountResult(contactService) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(RateResult, {
    props: { quote: new RateQuoteModel(49, 49, 1, 0), answers, steps: RATE_STEPS, contactService },
    global: { plugins: [router] },
  })
}

describe('RateResult', () => {
  it('shows the form after clicking "Quiero esta propuesta"', async () => {
    const wrapper = mountResult({ send: vi.fn() })

    expect(wrapper.find('form').exists()).toBe(false)
    await wrapper.find('.result__cta').trigger('click')

    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Tus respuestas ya van incluidas')
  })

  it('sends the request and shows the thank-you message', async () => {
    const service = { send: vi.fn().mockResolvedValue({}) }
    const wrapper = mountResult(service)
    await wrapper.find('.result__cta').trigger('click')

    await wrapper.find('#proposal-name').setValue('Ana López')
    await wrapper.find('#proposal-email').setValue('ana@mail.com')
    await wrapper.find('#proposal-gdpr').setValue(true)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(service.send).toHaveBeenCalledTimes(1)
    expect(service.send.mock.calls[0][0].message).toContain('Negocio: Restaurante')
    expect(wrapper.text()).toContain('¡Gracias! Hemos recibido tus respuestas')
  })
})
