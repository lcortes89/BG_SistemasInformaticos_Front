import BaseRepository from '@/core/apis/base/BaseRepository'

// GET /api/admin/{clients|brands|services}/export?format=pdf|xlsx (BGSI-254)
export default class ExportRepository extends BaseRepository {

  constructor() {
    super('/admin')
  }

  async findFile(resource, format, params = {}) {
    return this.getFile(`/${resource}/export`, { format, ...params })
  }
}
