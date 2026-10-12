import BaseRepository from '@/core/apis/base/BaseRepository'

export default class AdminClientRepository extends BaseRepository {

  constructor() {
    super('/admin/clients')
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
}
