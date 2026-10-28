import BaseRepository from '@/core/apis/base/BaseRepository'
import { withoutEmpty } from '@/core/apis/base/list-params'

// GET /api/admin/{clients|brands|services}/export?format=pdf|xlsx (BGSI-254) + the filters of the table (BGSI-302)
export default class ExportRepository extends BaseRepository {

  constructor() {
    super('/admin')
  }

  async findFile(resource, format, params = {}) {
    return this.getFile(`/${resource}/export`, { format, ...withoutEmpty(params) })
  }
}
