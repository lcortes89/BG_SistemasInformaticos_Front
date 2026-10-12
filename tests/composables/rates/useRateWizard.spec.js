import { describe, it, expect, vi } from 'vitest'
import { useRateWizard } from '@/composables/rates/useRateWizard'
import { RATE_STEPS } from '@/core/models/rate/rate-steps'

// Answers the current step with its first option and goes on
async function answerAndContinue(wizard) {
  wizard.select(wizard.currentStep.value.options[0].code)
  await wizard.next()
}

describe('useRateWizard', () => {
  it('starts on step 1 and cannot continue without an answer', async () => {
    const wizard = useRateWizard({ calculate: vi.fn() })

    await wizard.next()

    expect(wizard.stepIndex.value).toBe(0)
    expect(wizard.canContinue.value).toBe(false)
  })

  it('goes back without losing the answers', async () => {
    const wizard = useRateWizard({ calculate: vi.fn() })
    await answerAndContinue(wizard)

    wizard.back()

    expect(wizard.stepIndex.value).toBe(0)
    expect(wizard.answers.businessType).toBe('RESTAURANT')
    expect(wizard.canContinue.value).toBe(true)
  })

  it('calculates the quote after the last step', async () => {
    const quote = { monthlyPrice: 49 }
    const service = { calculate: vi.fn().mockResolvedValue(quote) }
    const wizard = useRateWizard(service)

    for (let i = 0; i < RATE_STEPS.length; i++) await answerAndContinue(wizard)

    expect(service.calculate).toHaveBeenCalledWith(expect.objectContaining({
      businessType: 'RESTAURANT', locations: 'ONE', posCount: 'ONE', space: 'INDOOR', squareMeters: 'SMALL',
    }))
    expect(wizard.quote.value).toEqual(quote)
    expect(wizard.isLoading.value).toBe(false)
  })

  it('keeps the error message when the API fails', async () => {
    const service = { calculate: vi.fn().mockRejectedValue(new Error('No se pudo conectar con el servidor.')) }
    const wizard = useRateWizard(service)

    for (let i = 0; i < RATE_STEPS.length; i++) await answerAndContinue(wizard)

    expect(wizard.quote.value).toBeNull()
    expect(wizard.error.value).toBe('No se pudo conectar con el servidor.')
  })

  it('restarts from scratch', async () => {
    const wizard = useRateWizard({ calculate: vi.fn() })
    await answerAndContinue(wizard)

    wizard.restart()

    expect(wizard.stepIndex.value).toBe(0)
    expect(wizard.answers.businessType).toBeNull()
  })
})
