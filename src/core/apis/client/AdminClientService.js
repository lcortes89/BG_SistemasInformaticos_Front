import AdminClientRepository from '@/core/apis/client/AdminClientRepository'
import ClientModel from '@/core/models/client/ClientModel'
import { clientMapper } from '@/core/mappers/client/client-mapper'

export default class AdminClientService {

  #repo

  constructor(repository = new AdminClientRepository()) {
    this.#repo = repository
  }

  // filters: { q, active } (BGSI-302)
  async getPage(page = 0, size = 10, filters = {}) {
    const response = await this.#repo.findPage(page, size, { q: filters.q, active: filters.active })
    return {
      items: response.content.map((dto) => ClientModel.create(dto, clientMapper)),
      page: response.page,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
    }
  }

  async create(form) {
    return ClientModel.create(await this.#repo.create(clientMapper.toRequest(form)), clientMapper)
  }

  async update(id, form) {
    return ClientModel.create(await this.#repo.update(id, clientMapper.toRequest(form)), clientMapper)
  }

  async remove(id) {
    await this.#repo.remove(id)
  }

  // BGSI-310: show (true) or hide (false) on the public website
  async setActive(id, active) {
    return ClientModel.create(await this.#repo.setActive(id, active), clientMapper)
  }
}
