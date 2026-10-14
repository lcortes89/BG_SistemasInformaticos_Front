import BaseRepository from '@/core/apis/base/BaseRepository'

// Public settings of the website (BGSI-230 / BGSI-231)
export default class SettingRepository extends BaseRepository {

  constructor() {
    super('/settings')
  }

  // GET /api/settings/hero -> { imageUrl } (null = default photo)
  async getHero() {
    return this.get('/hero')
  }
}
