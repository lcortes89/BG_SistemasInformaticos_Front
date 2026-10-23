import BaseRepository from '@/core/apis/base/BaseRepository'

export default class AdminBrandRepository extends BaseRepository {

  constructor() {
    super('/admin/brands')
  }

  async findPage(page, size) {
    return this.get('', { page, size })
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
