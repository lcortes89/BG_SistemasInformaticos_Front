import { computed, ref } from 'vue'
import AdminSettingService from '@/core/apis/setting/AdminSettingService'
import { useHeroImage } from '@/composables/layout/useHeroImage'

const URL_PATTERN = /^https?:\/\/\S+$/ // same rule as the backend (HeroImageRequestDTO)

// "Apariencia" screen of the admin panel: photo behind the public heroes (BGSI-230)
export function useAdminAppearance(service = new AdminSettingService()) {
  const { setHeroImage } = useHeroImage() // keeps the public views in sync
  const savedUrl = ref(null) // what the website shows now (null = default photo)
  const draftUrl = ref('')   // what the admin is choosing
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref(null)
  const feedback = ref(null)

  const isCustom = computed(() => !!savedUrl.value)
  const hasChanges = computed(() => draftUrl.value.trim() !== (savedUrl.value ?? ''))

  function validate() {
    const url = draftUrl.value.trim()
    if (!url) return 'Elige una foto: sube un archivo o pega una URL'
    if (url.length > 255) return 'Máximo 255 caracteres'
    if (!URL_PATTERN.test(url)) return 'La URL debe empezar por http:// o https://'
    return null
  }

  async function load() {
    isLoading.value = true
    error.value = null
    try {
      savedUrl.value = await service.getHeroImageUrl()
      draftUrl.value = savedUrl.value ?? ''
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function save() {
    feedback.value = null
    error.value = validate()
    if (error.value) return false

    isSaving.value = true
    try {
      savedUrl.value = await service.updateHeroImageUrl(draftUrl.value)
      draftUrl.value = savedUrl.value
      setHeroImage(savedUrl.value)
      feedback.value = 'Foto guardada. Ya se ve en las páginas públicas.'
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function reset() {
    feedback.value = null
    error.value = null
    isSaving.value = true
    try {
      await service.resetHeroImage()
      savedUrl.value = null
      draftUrl.value = ''
      setHeroImage(null)
      feedback.value = 'Se ha vuelto a la foto original.'
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      isSaving.value = false
    }
  }

  return { savedUrl, draftUrl, isLoading, isSaving, error, feedback, isCustom, hasChanges, load, save, reset }
}
