import AdminRateQuestionRepository from '@/core/apis/rate/AdminRateQuestionRepository'
import RateQuestionModel from '@/core/models/rate/RateQuestionModel'
import RateOptionModel from '@/core/models/rate/RateOptionModel'
import { rateOptionMapper, rateQuestionMapper } from '@/core/mappers/rate/rate-question-mapper'

const toQuestion = (dto) => RateQuestionModel.create(dto, rateQuestionMapper)
const toOption = (dto) => RateOptionModel.create(dto, rateOptionMapper)

export default class AdminRateQuestionService {

  #repo

  constructor(repository = new AdminRateQuestionRepository()) {
    this.#repo = repository
  }

  async getAll() {
    const dtos = await this.#repo.findAll()
    return dtos.map(toQuestion)
  }

  // id = null -> create, otherwise update
  async saveQuestion(id, form) {
    const body = rateQuestionMapper.toRequest(form)
    return toQuestion(id ? await this.#repo.update(id, body) : await this.#repo.create(body))
  }

  async removeQuestion(id) {
    await this.#repo.remove(id)
  }

  async reorder(ids) {
    const dtos = await this.#repo.reorder(ids)
    return dtos.map(toQuestion)
  }

  // optionId = null -> new option in that question, otherwise update
  async saveOption(questionId, optionId, form) {
    const body = rateOptionMapper.toRequest(form)
    return toOption(optionId
      ? await this.#repo.updateOption(optionId, body)
      : await this.#repo.addOption(questionId, body))
  }

  async removeOption(optionId) {
    await this.#repo.removeOption(optionId)
  }
}
