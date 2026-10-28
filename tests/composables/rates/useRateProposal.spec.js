import { describe, it, expect, vi } from 'vitest'
import { useRateProposal, RATE_PROPOSAL_SERVICE } from '@/composables/rates/useRateProposal'
import RateQuoteModel from '@/core/models/rate/RateQuoteModel'
import { RATE_STEPS } from '../../fixtures/rate-steps'

// { questionId: optionId }: Bar o Cafetería, 1 local, 1 TPV, interior, < 100 m²
const answers = { 1: 2, 2: 6, 3: 9, 4: 12, 5: 14 }
const quote = new RateQuoteModel(39, 39, 1, 0)

describe('useRateProposal', () => {
  it('does not send without name, email and GDPR consent', async () => {
    const service = { send: vi.fn() }
    const { errors, submit } = useRateProposal(service)

    expect(await submit(answers, quote)).toBe(false)
    expect(service.send).not.toHaveBeenCalled()
    expect(Object.keys(errors)).toEqual(['name', 'email', 'gdprConsent'])
  })

  it('sends a contact with the summary of the answers as the message', async () => {
    const service = { send: vi.fn().mockResolvedValue({}) }
    const { form, isSuccess, submit } = useRateProposal(service)
    Object.assign(form, { name: 'Ana', email: 'ana@mail.com', gdprConsent: true })

    expect(await submit(answers, quote, RATE_STEPS)).toBe(true)

    const sent = service.send.mock.calls[0][0]
    expect(sent.interestedService).toBe(RATE_PROPOSAL_SERVICE)
    expect(sent.message).toContain('Negocio: Bar o Cafetería')
    expect(sent.message).toContain('/mes')
    expect(isSuccess.value).toBe(true)
  })

  it('keeps the error message when the API fails', async () => {
    const service = { send: vi.fn().mockRejectedValue(new Error('No se pudo conectar con el servidor.')) }
    const { form, submitError, submit } = useRateProposal(service)
    Object.assign(form, { name: 'Ana', email: 'ana@mail.com', gdprConsent: true })

    await submit(answers, quote)

    expect(submitError.value).toBe('No se pudo conectar con el servidor.')
  })
})
