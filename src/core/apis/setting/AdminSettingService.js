import SettingService from '@/core/apis/setting/SettingService'
import AdminSettingRepository from '@/core/apis/setting/AdminSettingRepository'

// Admin side of the hero photo: read, change and reset it (BGSI-230)
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
}
