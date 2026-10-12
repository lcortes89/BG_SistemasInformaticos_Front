// Frontend representation of a service (what the views work with)
export default class ServiceModel {

  constructor(id, name, description, imageUrl, brandId, brandName) {
    this.id = id
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.brandId = brandId
    this.brandName = brandName
  }

  static create(dto, mapper) {
    return new ServiceModel(
      mapper.id(dto),
      mapper.name(dto),
      mapper.description(dto),
      mapper.imageUrl(dto),
      mapper.brandId(dto),
      mapper.brandName(dto),
    )
  }
}
