import SettingService from '@/core/apis/setting/SettingService'
import AdminSettingRepository from '@/core/apis/setting/AdminSettingRepository'

// Admin side of the website settings: hero photo (BGSI-230) and email notifications (BGSI-261)
export default class AdminSettingService {

  #publicService
  #adminRepo

  constructor(publicService = new SettingService(), adminRepository = new AdminSettingRepository()) {
    this.#publicService = publicService
    this.#adminRepo = adminRepository
  }

  // null when the website uses the default photo
  async getHeroImageUrl() {
    return this.#publicService.getHeroImageUrl()
  }

  async updateHeroImageUrl(imageUrl) {
    const { imageUrl: saved } = await this.#adminRepo.updateHero(imageUrl.trim())
    return saved
  }

  async resetHeroImage() {
    await this.#adminRepo.resetHero()
  }

  // { notifyEmail, senderName, senderAccount } (senderAccount is read only: it lives in the server .env)
  async getMailSettings() {
    return this.#adminRepo.findMail()
  }

  async updateMailSettings({ notifyEmail, senderName }) {
    return this.#adminRepo.updateMail({ notifyEmail: notifyEmail.trim(), senderName: senderName.trim() })
  }

  async sendTestMail() {
    await this.#adminRepo.sendTestMail()
  }
}
