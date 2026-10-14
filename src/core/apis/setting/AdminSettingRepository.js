import BaseRepository from '@/core/apis/base/BaseRepository'

// Settings that only an ADMIN can change (BGSI-230)
export default class AdminSettingRepository extends BaseRepository {

  constructor() {
    super('/admin/settings')
  }

  // PUT /api/admin/settings/hero { imageUrl } -> { imageUrl }
  async updateHero(imageUrl) {
    return this.put('/hero', { imageUrl })
  }

  // DELETE /api/admin/settings/hero -> 204 (back to the default photo)
  async resetHero() {
    return this.delete('/hero')
  }
}
