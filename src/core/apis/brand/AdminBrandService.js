import AdminBrandRepository from '@/core/apis/brand/AdminBrandRepository'
import BrandModel from '@/core/models/brand/BrandModel'
import { brandMapper } from '@/core/mappers/brand/brand-mapper'

export default class AdminBrandService {

  #repo

  constructor(repository = new AdminBrandRepository()) {
    this.#repo = repository
  }

  async getPage(page = 0, size = 10) {
    const response = await this.#repo.findPage(page, size)
    return {
      items: response.content.map((dto) => BrandModel.create(dto, brandMapper)),
      page: response.page,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
    }
  }

  // For the brand selector of the service form (the backend allows up to 50 per page)
  async getOptions() {
    const { items } = await this.getPage(0, 50)
    return items
  }

  async create(form) {
    return BrandModel.create(await this.#repo.create(brandMapper.toRequest(form)), brandMapper)
  }

  async update(id, form) {
    return BrandModel.create(await this.#repo.update(id, brandMapper.toRequest(form)), brandMapper)
  }

  async remove(id) {
    await this.#repo.remove(id)
  }

  // BGSI-310: show (true) or hide (false) on the public website
  async setActive(id, active) {
    return BrandModel.create(await this.#repo.setActive(id, active), brandMapper)
  }
}
