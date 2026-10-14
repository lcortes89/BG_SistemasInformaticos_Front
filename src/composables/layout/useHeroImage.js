import { ref } from 'vue'
import SettingService from '@/core/apis/setting/SettingService'

// Shared by the whole app (one value for every view): the photo chosen in "Apariencia".
// null = no photo chosen -> PageBackdrop shows the default one (BGSI-231)
const heroImageUrl = ref(null)

export function useHeroImage(service = new SettingService()) {

  // Called once when the app starts. If the backend fails, the website keeps the default photo
  async function loadHeroImage() {
    try {
      heroImageUrl.value = await service.getHeroImageUrl()
    } catch {
      heroImageUrl.value = null
    }
  }

  // The admin saved or reset the photo: the public views change without reloading
  function setHeroImage(url) {
    heroImageUrl.value = url || null
  }

  return { heroImageUrl, loadHeroImage, setHeroImage }
}
