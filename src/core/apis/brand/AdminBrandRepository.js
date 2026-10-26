import BaseRepository from '@/core/apis/base/BaseRepository'
import { listParams } from '@/core/apis/base/list-params'

export default class AdminBrandRepository extends BaseRepository {

  constructor() {
    super('/admin/brands')
  }

  // GET /api/admin/brands?page=0&size=6&q=bdp&active=true (filters: BGSI-302)
  async findPage(page, size, filters = {}) {
    return this.get('', listParams(page, size, filters))
  }

  async create(body) {
    return this.post('', body)
  }

  async update(id, body) {
    return this.put(`/${id}`, body)
  }

  async remove(id) {
    return this.delete(`/${id}`)
  }

  // BGSI-310: PATCH /api/admin/brands/{id}/active { active } -> shown or hidden on the website
  async setActive(id, active) {
    return this.patch(`/${id}/active`, { active })
  }
}
