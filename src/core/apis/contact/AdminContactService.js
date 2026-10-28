import AdminContactRepository from '@/core/apis/contact/AdminContactRepository'
import ContactModel from '@/core/models/contact/ContactModel'
import { contactMapper } from '@/core/mappers/contact/contact-mapper'

export default class AdminContactService {

  #repo

  constructor(repository = new AdminContactRepository()) {
    this.#repo = repository
  }

  // filters: { status, q }. null = all (q: BGSI-302)
  async getPage(page = 0, size = 10, filters = {}) {
    const response = await this.#repo.findPage(page, size, { status: filters.status, q: filters.q })
    return {
      items: response.content.map((dto) => ContactModel.create(dto, contactMapper)),
      page: response.page,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
    }
  }

  // changes: { status } and/or { note }
  async update(id, changes) {
    const dto = await this.#repo.update(id, changes)
    return ContactModel.create(dto, contactMapper)
  }

  // BGSI-308: the contact is deleted for good
  async remove(id) {
    await this.#repo.remove(id)
  }
}
