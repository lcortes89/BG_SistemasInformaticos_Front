import RateRepository from '@/core/apis/rate/RateRepository'
import RateQuoteModel from '@/core/models/rate/RateQuoteModel'
import { rateMapper } from '@/core/mappers/rate/rate-mapper'

export default class RateService {

  #repo

  constructor(repository = new RateRepository()) {
    this.#repo = repository
  }

  // answers: the 5 option codes chosen in the wizard
  async calculate(answers) {
    const dto = await this.#repo.calculate(rateMapper.toRequest(answers))
    return RateQuoteModel.create(dto, rateMapper)
  }
}
