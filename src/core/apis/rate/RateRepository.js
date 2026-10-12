import BaseRepository from '@/core/apis/base/BaseRepository'

export default class RateRepository extends BaseRepository {

  constructor() {
    super('/rates')
  }

  // POST /api/rates/calculate  { businessType, locations, posCount, space, squareMeters }
  async calculate(body) {
    return this.post('/calculate', body)
  }
}
