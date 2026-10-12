import ServiceRepository from '@/core/apis/service/ServiceRepository'
import ServiceModel from '@/core/models/service/ServiceModel'
import { serviceMapper } from '@/core/mappers/service/service-mapper'

export default class ServiceService {

  #repo

  // The repository can be replaced by a fake one in the tests
  constructor(repository = new ServiceRepository()) {
    this.#repo = repository
  }

  async getFeatured() {
    const dtos = await this.#repo.findFeatured()
    return dtos.map((dto) => ServiceModel.create(dto, serviceMapper))
  }
}
