import { describe, it, expect, vi } from 'vitest'
import AdminRateQuestionService from '@/core/apis/rate/AdminRateQuestionService'
import RateQuestionModel from '@/core/models/rate/RateQuestionModel'
import RateOptionModel from '@/core/models/rate/RateOptionModel'

const questionDto = {
  id: 1, title: 'Negocio', question: '¿Qué tipo de negocio tienes?', hint: null, position: 0, active: true,
  options: [{ id: 1, icon: '🍽️', label: 'Restaurante', description: null, amount: '49.00', adjustmentType: 'BASE', position: 0 }],
}

describe('AdminRateQuestionService (BGSI-234)', () => {
  it('returns the questions as models, with their options and numeric amounts', async () => {
    const repo = { findAll: vi.fn().mockResolvedValue([questionDto]) }

    const [question] = await new AdminRateQuestionService(repo).getAll()

    expect(question).toBeInstanceOf(RateQuestionModel)
    expect(question.hint).toBe('')
    expect(question.options[0]).toBeInstanceOf(RateOptionModel)
    expect(question.options[0].amount).toBe(49)
  })

  it('creates a question when there is no id and updates it when there is one', async () => {
    const repo = { create: vi.fn().mockResolvedValue(questionDto), update: vi.fn().mockResolvedValue(questionDto) }
    const service = new AdminRateQuestionService(repo)
    const form = { title: ' Negocio ', question: '¿Qué tipo de negocio tienes?', hint: '  ', active: true }

    await service.saveQuestion(null, form)
    await service.saveQuestion(1, form)

    const body = { title: 'Negocio', question: '¿Qué tipo de negocio tienes?', hint: null, active: true }
    expect(repo.create).toHaveBeenCalledWith(body)
    expect(repo.update).toHaveBeenCalledWith(1, body)
  })

  it('sends the amount of an option as a number', async () => {
    const repo = { addOption: vi.fn().mockResolvedValue(questionDto.options[0]), updateOption: vi.fn() }

    await new AdminRateQuestionService(repo).saveOption(1, null,
      { icon: '💳', label: 'Tarjeta', description: '', amount: '5.50', adjustmentType: 'ADDITION' })

    expect(repo.addOption).toHaveBeenCalledWith(1,
      { icon: '💳', label: 'Tarjeta', description: null, amount: 5.5, adjustmentType: 'ADDITION' })
    expect(repo.updateOption).not.toHaveBeenCalled()
  })

  it('sends the new order of the questions', async () => {
    const repo = { reorder: vi.fn().mockResolvedValue([questionDto]) }

    await new AdminRateQuestionService(repo).reorder([3, 1, 2])

    expect(repo.reorder).toHaveBeenCalledWith([3, 1, 2])
  })
})
