import BaseRepository from '@/core/apis/base/BaseRepository'

export default class AdminServiceRepository extends BaseRepository {

  constructor() {
    super('/admin/services')
  }

  // brandId = null -> all brands
  async findPage(page, size, brandId = null) {
    const params = { page, size }
    if (brandId) params.brandId = brandId
    return this.get('', params)
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
