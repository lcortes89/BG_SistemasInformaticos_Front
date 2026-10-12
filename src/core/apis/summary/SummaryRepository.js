import BaseRepository from '@/core/apis/base/BaseRepository'

export default class SummaryRepository extends BaseRepository {

  constructor() {
    super('/admin/summary')
  }

  // GET /api/admin/summary
  async find() {
    return this.get()
  }
}
