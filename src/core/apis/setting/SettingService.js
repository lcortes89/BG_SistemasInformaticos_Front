import SettingRepository from '@/core/apis/setting/SettingRepository'

// Public settings read by the website (BGSI-231)
export default class SettingService {

  #repo

  constructor(repository = new SettingRepository()) {
    this.#repo = repository
  }

  // null when the website uses the default photo
  async getHeroImageUrl() {
    const { imageUrl } = await this.#repo.getHero()
    return imageUrl ?? null
  }
}
