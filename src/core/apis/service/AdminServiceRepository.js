import BaseRepository from '@/core/apis/base/BaseRepository'
import { listParams } from '@/core/apis/base/list-params'

export default class AdminServiceRepository extends BaseRepository {

  constructor() {
    super('/admin/services')
  }

  // GET /api/admin/services?page=0&size=6&brandId=1&q=one&active=true. Empty filters are not sent (BGSI-302)
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

  // BGSI-310: PATCH /api/admin/services/{id}/active { active } -> shown or hidden on the website
  async setActive(id, active) {
    return this.patch(`/${id}/active`, { active })
  }
}
