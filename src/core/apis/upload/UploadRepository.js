import BaseRepository from '@/core/apis/base/BaseRepository'

export default class UploadRepository extends BaseRepository {

  constructor() {
    super('/admin/uploads')
  }

  // POST /api/admin/uploads (multipart/form-data, field "file") -> { url }
  // With FormData, axios sets the multipart header by itself
  async upload(file) {
    const body = new FormData()
    body.append('file', file)
    return this.post('', body)
  }
}
