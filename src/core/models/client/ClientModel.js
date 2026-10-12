export default class ClientModel {

  constructor(id, name, businessType, testimonial, logoUrl, rating, published = true) {
    this.id = id
    this.name = name
    this.businessType = businessType
    this.testimonial = testimonial
    this.logoUrl = logoUrl
    this.rating = rating
    this.published = published
  }

  getInitials() {
    return this.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('')
  }

  static create(dto, mapper) {
    return new ClientModel(
      mapper.id(dto),
      mapper.name(dto),
      mapper.businessType(dto),
      mapper.testimonial(dto),
      mapper.logoUrl(dto),
      mapper.rating(dto),
      mapper.published(dto),
    )
  }
}
