import ServiceRepository from '@/core/apis/service/ServiceRepository'
import ServiceModel from '@/core/models/service/ServiceModel'
import { serviceMapper } from '@/core/mappers/service/service-mapper'

export default class ServiceService {

  #repo

  constructor(repository = new ServiceRepository()) {
    this.#repo = repository
  }

  async getAll() {
    const dtos = await this.#repo.findAll()
    return dtos.map((dto) => ServiceModel.create(dto, serviceMapper))
  }

  async getFeatured() {
    const dtos = await this.#repo.findFeatured()
    return dtos.map((dto) => ServiceModel.create(dto, serviceMapper))
  }
}
