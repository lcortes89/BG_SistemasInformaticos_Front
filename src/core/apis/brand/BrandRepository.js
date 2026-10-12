import BaseRepository from '@/core/apis/base/BaseRepository'

export default class BrandRepository extends BaseRepository {

  constructor() {
    super('/brands')
  }

  // GET /api/brands
  async findAll() {
    return this.get()
  }

  // GET /api/brands/{id}/services
  async findServicesByBrand(brandId) {
    return this.get(`/${brandId}/services`)
  }
}
