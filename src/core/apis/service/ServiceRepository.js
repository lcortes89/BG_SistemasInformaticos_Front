import BaseRepository from '@/core/apis/base/BaseRepository'

export default class ServiceRepository extends BaseRepository {

  constructor() {
    super('/services')
  }

  // GET /api/services?featured=true
  async findFeatured() {
    return this.get('', { featured: true })
  }
}
