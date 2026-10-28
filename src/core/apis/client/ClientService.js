import ClientRepository from '@/core/apis/client/ClientRepository'
import ClientModel from '@/core/models/client/ClientModel'
import { clientMapper } from '@/core/mappers/client/client-mapper'

export default class ClientService {

  #repo

  constructor(repository = new ClientRepository()) {
    this.#repo = repository
  }

  // Returns the clients of one page + the pagination info
  async getPublished(page = 0, size = 6) {
    const response = await this.#repo.findPublished(page, size)
    return {
      items: response.content.map((dto) => ClientModel.create(dto, clientMapper)),
      page: response.page,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
    }
  }
}
