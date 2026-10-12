import BaseRepository from '@/core/apis/base/BaseRepository'

export default class ContactRepository extends BaseRepository {

  constructor() {
    super('/contacts')
  }

  // POST /api/contacts
  async send(body) {
    return this.post('', body)
  }
}
