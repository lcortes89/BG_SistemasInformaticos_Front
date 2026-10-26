import AdminServiceRepository from '@/core/apis/service/AdminServiceRepository'
import ServiceModel from '@/core/models/service/ServiceModel'
import { serviceMapper } from '@/core/mappers/service/service-mapper'

// "Service" twice on purpose: the business entity is called Service (a product of a brand)
export default class AdminServiceService {

  #repo

  constructor(repository = new AdminServiceRepository()) {
    this.#repo = repository
  }

  // filters: { brandId, q, active } (q and active: BGSI-302)
  async getPage(page = 0, size = 10, filters = {}) {
    const response = await this.#repo.findPage(page, size,
      { brandId: filters.brandId, q: filters.q, active: filters.active })
    return {
      items: response.content.map((dto) => ServiceModel.create(dto, serviceMapper)),
      page: response.page,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
    }
  }

  async create(form) {
    return ServiceModel.create(await this.#repo.create(serviceMapper.toRequest(form)), serviceMapper)
  }

  async update(id, form) {
    return ServiceModel.create(await this.#repo.update(id, serviceMapper.toRequest(form)), serviceMapper)
  }

  async remove(id) {
    await this.#repo.remove(id)
  }

  // BGSI-310: show (true) or hide (false) on the public website
  async setActive(id, active) {
    return ServiceModel.create(await this.#repo.setActive(id, active), serviceMapper)
  }
}
