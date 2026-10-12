import SummaryRepository from '@/core/apis/summary/SummaryRepository'
import SummaryModel from '@/core/models/summary/SummaryModel'
import { summaryMapper } from '@/core/mappers/summary/summary-mapper'

export default class SummaryService {

  #repo

  constructor(repository = new SummaryRepository()) {
    this.#repo = repository
  }

  async get() {
    return SummaryModel.create(await this.#repo.find(), summaryMapper)
  }
}
