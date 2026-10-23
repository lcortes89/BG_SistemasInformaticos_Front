// Frontend representation of a service (what the views work with)
export default class ServiceModel {

  constructor(id, name, description, imageUrl, brandId, brandName, featured = false,
              longDescription = '', features = [], sectors = [], officialUrl = null, active = true) {
    this.id = id
    this.name = name
    this.description = description
    this.imageUrl = imageUrl
    this.brandId = brandId
    this.brandName = brandName
    this.featured = featured
    this.longDescription = longDescription
    this.features = features
    this.sectors = sectors
    this.officialUrl = officialUrl
    this.active = active // BGSI-310: false = hidden from the public website
  }

  static create(dto, mapper) {
    return new ServiceModel(
      mapper.id(dto),
      mapper.name(dto),
      mapper.description(dto),
      mapper.imageUrl(dto),
      mapper.brandId(dto),
      mapper.brandName(dto),
      mapper.featured(dto),
      mapper.longDescription(dto),
      mapper.features(dto),
      mapper.sectors(dto),
      mapper.officialUrl(dto),
      mapper.active(dto),
    )
  }
}
