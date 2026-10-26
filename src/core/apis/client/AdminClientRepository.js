import BaseRepository from '@/core/apis/base/BaseRepository'
import { listParams } from '@/core/apis/base/list-params'

export default class AdminClientRepository extends BaseRepository {

  constructor() {
    super('/admin/clients')
  }

  // GET /api/admin/clients?page=0&size=6&q=bar&active=true (filters: BGSI-302)
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

  // BGSI-310: PATCH /api/admin/clients/{id}/active { active } -> shown or hidden on the website
  async setActive(id, active) {
    return this.patch(`/${id}/active`, { active })
  }
}
