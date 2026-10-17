import { computed, reactive, ref } from 'vue'
import AdminSettingService from '@/core/apis/setting/AdminSettingService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TEST_ERROR = 'No se pudo enviar el correo de prueba. Revisa la configuración del correo en el servidor.'

const normalize = (email) => email.trim().toLowerCase()

// "Ajustes > Avisos por correo" of the admin panel (BGSI-261)
export function useAdminMailSettings(service = new AdminSettingService()) {
  const saved = ref(null) // what the backend has now
  const form = reactive({ notifyEmail: '', confirmEmail: '', senderName: '' })
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isSendingTest = ref(false)
  const error = ref(null)
  const feedback = ref(null)

  // A new recipient must be typed twice (the second time by hand)
  const emailChanged = computed(() => !!saved.value && normalize(form.notifyEmail) !== normalize(saved.value.notifyEmail ?? ''))
  const emailsMatch = computed(() => !emailChanged.value || normalize(form.confirmEmail) === normalize(form.notifyEmail))
  const confirmError = computed(() =>
    emailChanged.value && form.confirmEmail.trim() && !emailsMatch.value ? 'Los dos emails no coinciden.' : null)

  const hasChanges = computed(() =>
    !!saved.value && (emailChanged.value || form.senderName.trim() !== (saved.value.senderName ?? '')))
  const canSave = computed(() => hasChanges.value && emailsMatch.value && !isSaving.value)

  function fill(settings) {
    saved.value = settings
    form.notifyEmail = settings.notifyEmail ?? ''
    form.confirmEmail = ''
    form.senderName = settings.senderName ?? ''
  }

  function validate() {
    const email = form.notifyEmail.trim()
    if (!email) return 'Escribe el email que recibe los contactos'
    if (email.length > 255) return 'Máximo 255 caracteres'
    if (!EMAIL_PATTERN.test(email)) return 'El formato del email no es válido'
    if (!emailsMatch.value) return 'Los dos emails no coinciden.'
    if (form.senderName.trim().length > 60) return 'El nombre del remitente admite máximo 60 caracteres'
    return null
  }

  async function load() {
    isLoading.value = true
    error.value = null
    try {
      fill(await service.getMailSettings())
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
      fill(await service.updateMailSettings(form))
      feedback.value = `Avisos guardados. Los próximos contactos llegarán a ${saved.value.notifyEmail}.`
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function sendTest() {
    feedback.value = null
    error.value = null
    isSendingTest.value = true
    try {
      await service.sendTestMail()
      feedback.value = `Correo de prueba enviado a ${saved.value.notifyEmail}. Revisa la bandeja de entrada (y la de spam).`
      return true
    } catch {
      error.value = TEST_ERROR
      return false
    } finally {
      isSendingTest.value = false
    }
  }

  return {
    saved, form, isLoading, isSaving, isSendingTest, error, feedback,
    emailChanged, confirmError, hasChanges, canSave, load, save, sendTest,
  }
}
