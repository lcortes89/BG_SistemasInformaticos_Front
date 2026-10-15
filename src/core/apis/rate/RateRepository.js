import BaseRepository from '@/core/apis/base/BaseRepository'

export default class RateRepository extends BaseRepository {

  constructor() {
    super('/rates')
  }

  // GET /api/rates/steps -> the questions of the wizard, without prices (BGSI-235)
  async findSteps() {
    return this.get('/steps')
  }

  // POST /api/rates/calculate  { optionIds: [1, 7, 10, 13, 15] }
  async calculate(body) {
    return this.post('/calculate', body)
  }
}
