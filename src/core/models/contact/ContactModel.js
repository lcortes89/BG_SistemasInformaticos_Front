// What the backend answers after saving a contact
export default class ContactModel {

  constructor(id, name, status, createdAt) {
    this.id = id
    this.name = name
    this.status = status
    this.createdAt = createdAt
  }

  static create(dto, mapper) {
    return new ContactModel(mapper.id(dto), mapper.name(dto), mapper.status(dto), mapper.createdAt(dto))
  }
}
