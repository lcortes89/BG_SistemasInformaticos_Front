import { describe, it, expect, vi } from 'vitest'
import { useRateWizard } from '@/composables/rates/useRateWizard'
import { RATE_STEPS } from '../../fixtures/rate-steps'

// Answers the current step with its first option and goes on
async function answerAndContinue(wizard) {
  wizard.select(wizard.currentStep.value.options[0].code)
  await wizard.next()
}

describe('useRateWizard', () => {
  it('loads the questions from the API (BGSI-235)', async () => {
    const service = { getSteps: vi.fn().mockResolvedValue(RATE_STEPS), calculate: vi.fn() }
    const wizard = useRateWizard(service)

    await wizard.loadSteps()

    expect(wizard.steps.value).toHaveLength(5)
    expect(wizard.currentStep.value.title).toBe('Negocio')
    expect(wizard.isLoadingSteps.value).toBe(false)
  })

  it('keeps the error when the questions cannot be loaded', async () => {
    const service = { getSteps: vi.fn().mockRejectedValue(new Error('Server down')), calculate: vi.fn() }
    const wizard = useRateWizard(service)

    await wizard.loadSteps()

    expect(wizard.stepsError.value).toBe('Server down')
    expect(wizard.currentStep.value).toBeNull()
  })

  it('starts on step 1 and cannot continue without an answer', async () => {
    const wizard = useRateWizard({ calculate: vi.fn() }, RATE_STEPS)

    await wizard.next()

    expect(wizard.stepIndex.value).toBe(0)
    expect(wizard.canContinue.value).toBe(false)
  })

  it('goes back without losing the answers', async () => {
    const wizard = useRateWizard({ calculate: vi.fn() }, RATE_STEPS)
    await answerAndContinue(wizard)

    wizard.back()

    expect(wizard.stepIndex.value).toBe(0)
    expect(wizard.answers['1']).toBe(1)
    expect(wizard.canContinue.value).toBe(true)
  })

  it('calculates the quote after the last step', async () => {
    const quote = { monthlyPrice: 49 }
    const service = { calculate: vi.fn().mockResolvedValue(quote) }
    const wizard = useRateWizard(service, RATE_STEPS)

    for (let i = 0; i < RATE_STEPS.length; i++) await answerAndContinue(wizard)

    expect(service.calculate).toHaveBeenCalledWith({ 1: 1, 2: 6, 3: 9, 4: 12, 5: 14 })
    expect(wizard.quote.value).toEqual(quote)
    expect(wizard.isLoading.value).toBe(false)
  })

  it('keeps the error message when the API fails', async () => {
    const service = { calculate: vi.fn().mockRejectedValue(new Error('No se pudo conectar con el servidor.')) }
    const wizard = useRateWizard(service, RATE_STEPS)

    for (let i = 0; i < RATE_STEPS.length; i++) await answerAndContinue(wizard)

    expect(wizard.quote.value).toBeNull()
    expect(wizard.error.value).toBe('No se pudo conectar con el servidor.')
  })

  it('restarts from scratch', async () => {
    const wizard = useRateWizard({ calculate: vi.fn() }, RATE_STEPS)
    await answerAndContinue(wizard)

    wizard.restart()

    expect(wizard.stepIndex.value).toBe(0)
    expect(wizard.answers['1']).toBeNull()
  })
})
