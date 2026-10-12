import BaseRepository from '@/core/apis/base/BaseRepository'

export default class ClientRepository extends BaseRepository {

  constructor() {
    super('/clients')
  }

  // GET /api/clients?page=0&size=6  -> PageResponseDTO from the backend
  async findPublished(page, size) {
    return this.get('', { page, size })
  }
}
