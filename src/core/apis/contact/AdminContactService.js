import AdminContactRepository from '@/core/apis/contact/AdminContactRepository'
import ContactModel from '@/core/models/contact/ContactModel'
import { contactMapper } from '@/core/mappers/contact/contact-mapper'

export default class AdminContactService {

  #repo

  constructor(repository = new AdminContactRepository()) {
    this.#repo = repository
  }

  // status = null -> all contacts
  async getPage(status = null, page = 0, size = 10) {
    const response = await this.#repo.findPage(status, page, size)
    return {
      items: response.content.map((dto) => ContactModel.create(dto, contactMapper)),
      page: response.page,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
    }
  }
}
