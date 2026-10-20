import { describe, it, expect, vi } from 'vitest'
import { useAdminRateQuestions } from '@/composables/admin/useAdminRateQuestions'
import RateQuestionModel from '@/core/models/rate/RateQuestionModel'
import RateOptionModel from '@/core/models/rate/RateOptionModel'

function questions() {
  return [
    new RateQuestionModel(1, 'Negocio', '¿Negocio?', '', 0, true,
      [new RateOptionModel(1, '🍽️', 'Restaurante', '', 49, 'BASE')]),
    new RateQuestionModel(2, 'Locales', '¿Locales?', '', 1, true,
      [new RateOptionModel(6, '🏠', '1 local', '', 1, 'FACTOR')]),
  ]
}

function fakeService(overrides = {}) {
  return { getAll: vi.fn().mockResolvedValue(questions()), ...overrides }
}

describe('useAdminRateQuestions (BGSI-234)', () => {
  it('loads the questions', async () => {
    const admin = useAdminRateQuestions(fakeService())

    await admin.load()

    expect(admin.questions.value).toHaveLength(2)
    expect(admin.isLoading.value).toBe(false)
  })

  it('moves a question down and saves the new order', async () => {
    const service = fakeService({ reorder: vi.fn().mockResolvedValue([]) })
    const admin = useAdminRateQuestions(service)
    await admin.load()

    await admin.move(admin.questions.value[0], 1)

    expect(service.reorder).toHaveBeenCalledWith([2, 1])
    expect(admin.feedback.value).toBe('Orden guardado')
  })

  it('does not move the first question up', async () => {
    const service = fakeService({ reorder: vi.fn() })
    const admin = useAdminRateQuestions(service)
    await admin.load()

    expect(await admin.move(admin.questions.value[0], -1)).toBe(false)
    expect(service.reorder).not.toHaveBeenCalled()
  })

  it('hides a visible question', async () => {
    const service = fakeService({ saveQuestion: vi.fn().mockResolvedValue({}) })
    const admin = useAdminRateQuestions(service)
    await admin.load()

    await admin.toggleActive(admin.questions.value[1])

    expect(service.saveQuestion).toHaveBeenCalledWith(2, expect.objectContaining({ active: false }))
    expect(admin.feedback.value).toBe('"Locales" oculta en la web')
  })

  it('does not save a factor of 0 and shows the error in its row', async () => {
    const service = fakeService({ saveOption: vi.fn() })
    const admin = useAdminRateQuestions(service)
    await admin.load()
    const [, locations] = admin.questions.value

    const saved = await admin.saveOptionPrice(locations, locations.options[0], { adjustmentType: 'FACTOR', amount: '0' })

    expect(saved).toBe(false)
    expect(service.saveOption).not.toHaveBeenCalled()
    expect(admin.rowErrors[6]).toBe('Un multiplicador debe ser mayor que 0')
  })

  it('saves a new price inline', async () => {
    const service = fakeService({
      saveOption: vi.fn().mockResolvedValue(new RateOptionModel(1, '🍽️', 'Restaurante', '', 55, 'BASE')),
    })
    const admin = useAdminRateQuestions(service)
    await admin.load()
    const [business] = admin.questions.value

    await admin.saveOptionPrice(business, business.options[0], { adjustmentType: 'BASE', amount: '55' })

    expect(service.saveOption).toHaveBeenCalledWith(1, 1, expect.objectContaining({ amount: '55', label: 'Restaurante' }))
    expect(business.options[0].amount).toBe(55)
    expect(admin.feedback.value).toBe('Restaurante: precio guardado')
  })

  it('keeps the error when a change fails', async () => {
    const service = fakeService({ removeQuestion: vi.fn().mockRejectedValue(new Error('Server down')) })
    const admin = useAdminRateQuestions(service)
    await admin.load()

    await admin.removeQuestion(admin.questions.value[0])

    expect(admin.actionError.value).toBe('Server down')
  })

  it('closing "Confirma tu contraseña" is not an error (BGSI-275)', async () => {
    const service = fakeService({ removeQuestion: vi.fn().mockRejectedValue(Object.assign(new Error('Acción cancelada'), { cancelled: true })) })
    const admin = useAdminRateQuestions(service)
    await admin.load()

    expect(await admin.removeQuestion(admin.questions.value[0])).toBe(false)
    expect(admin.actionError.value).toBeNull()
  })
})
