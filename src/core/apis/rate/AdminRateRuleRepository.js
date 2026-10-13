import BaseRepository from '@/core/apis/base/BaseRepository'

export default class AdminRateRuleRepository extends BaseRepository {

  constructor() {
    super('/admin/rate-rules')
  }

  // GET /api/admin/rate-rules -> [{ category, rules: [...] }]
  async findAll() {
    return this.get()
  }

  // PUT /api/admin/rate-rules/{id}  { amount }
  async updateAmount(id, amount) {
    return this.put(`/${id}`, { amount })
  }
}
