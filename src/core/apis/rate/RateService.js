import RateRepository from '@/core/apis/rate/RateRepository'
import RateQuoteModel from '@/core/models/rate/RateQuoteModel'
import { rateMapper } from '@/core/mappers/rate/rate-mapper'

export default class RateService {

  #repo

  constructor(repository = new RateRepository()) {
    this.#repo = repository
  }

  // The questions the admin has published (BGSI-235)
  async getSteps() {
    const dtos = await this.#repo.findSteps()
    return dtos.map(rateMapper.step)
  }

  // answers: { questionId: optionId } chosen in the wizard
  async calculate(answers) {
    const dto = await this.#repo.calculate(rateMapper.toRequest(answers))
    return RateQuoteModel.create(dto, rateMapper)
  }
}
