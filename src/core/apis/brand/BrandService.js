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

  async getServices(brandId) {
    const dtos = await this.#repo.findServicesByBrand(brandId)
    return dtos.map((dto) => ServiceModel.create(dto, serviceMapper))
  }
}
