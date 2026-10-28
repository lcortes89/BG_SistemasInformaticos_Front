import BaseRepository from '@/core/apis/base/BaseRepository'

// Settings that only an ADMIN can change (BGSI-230, BGSI-261)
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

  // GET /api/admin/settings/mail -> { notifyEmail, senderName, senderAccount }
  async findMail() {
    return this.get('/mail')
  }

  // PUT /api/admin/settings/mail { notifyEmail, senderName } -> the saved settings
  async updateMail(body) {
    return this.put('/mail', body)
  }

  // POST /api/admin/settings/mail/test -> 204, or 503 if Gmail fails
  async sendTestMail() {
    return this.post('/mail/test')
  }
}
