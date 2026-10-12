import BaseRepository from '@/core/apis/base/BaseRepository'

export default class AdminContactRepository extends BaseRepository {

  constructor() {
    super('/admin/contacts')
  }

  // GET /api/admin/contacts?status=NEW&page=0&size=10 (the interceptor adds the token)
  async findPage(status, page, size) {
    const params = { page, size }
    if (status) params.status = status
    return this.get('', params)
  }

  // PATCH /api/admin/contacts/{id}  { status?, note? }
  async update(id, changes) {
    return this.patch(`/${id}`, changes)
  }
}
