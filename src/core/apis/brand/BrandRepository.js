import BaseRepository from '@/core/apis/base/BaseRepository'

export default class BrandRepository extends BaseRepository {

  constructor() {
    super('/brands')
  }

  // GET /api/brands
  async findAll() {
    return this.get()
  }

  // GET /api/brands/{id}/services?page=0&size=4 -> PageResponseDTO from the backend (BGSI-248)
  async findServicesByBrand(brandId, page, size) {
    return this.get(`/${brandId}/services`, { page, size })
  }
}
