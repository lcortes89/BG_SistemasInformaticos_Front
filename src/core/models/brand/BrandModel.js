export default class BrandModel {

  constructor(id, name, description, category, logoUrl, active = true, serviceCount = 0) {
    this.id = id
    this.name = name
    this.description = description
    this.category = category
    this.logoUrl = logoUrl
    this.active = active
    this.serviceCount = serviceCount
  }

  // Two-letter badge used while there are no real logo images (e.g. "BD", "AH")
  getInitials() {
    return this.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase()
  }

  static create(dto, mapper) {
    return new BrandModel(
      mapper.id(dto),
      mapper.name(dto),
      mapper.description(dto),
      mapper.category(dto),
      mapper.logoUrl(dto),
      mapper.active(dto),
      mapper.serviceCount(dto),
    )
  }
}
