import ContactRepository from '@/core/apis/contact/ContactRepository'
import ContactModel from '@/core/models/contact/ContactModel'
import { contactMapper } from '@/core/mappers/contact/contact-mapper'

export default class ContactService {

  #repo

  constructor(repository = new ContactRepository()) {
    this.#repo = repository
  }

  async send(form) {
    const dto = await this.#repo.send(contactMapper.toRequest(form))
    return ContactModel.create(dto, contactMapper)
  }
}
