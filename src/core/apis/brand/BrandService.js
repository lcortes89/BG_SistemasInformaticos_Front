import BrandRepository from '@/core/apis/brand/BrandRepository'
import BrandModel from '@/core/models/brand/BrandModel'
import ServiceModel from '@/core/models/service/ServiceModel'
import { brandMapper } from '@/core/mappers/brand/brand-mapper'
import { serviceMapper } from '@/core/mappers/service/service-mapper'

export default class BrandService {

  #repo

  constructor(repository = new BrandRepository()) {
    this.#repo = repository
  }

  async getAll() {
    const dtos = await this.#repo.findAll()
    return dtos.map((dto) => BrandModel.create(dto, brandMapper))
  }

  // Returns the products of one page + the pagination info (BGSI-248)
  async getServices(brandId, page = 0, size = 4) {
    const response = await this.#repo.findServicesByBrand(brandId, page, size)
    return {
      items: response.content.map((dto) => ServiceModel.create(dto, serviceMapper)),
      page: response.page,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
    }
  }
}
