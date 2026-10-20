import { ref } from 'vue'
import AccountService from '@/core/apis/account/AccountService'
import { lockedMessage } from '@/composables/admin/useLoginForm'

// BGSI-275: form of "Confirma tu contraseña". submit() returns { token, expiresInSeconds } or null
export function useConfirmPasswordForm(service = new AccountService()) {
  const password = ref('')
  const error = ref(null)
  const isSubmitting = ref(false)

  async function submit() {
    error.value = null
    if (!password.value) {
      error.value = 'Escribe tu contraseña'
      return null
    }

    isSubmitting.value = true
    try {
      const result = await service.confirmPassword(password.value)
      password.value = ''
      return result
    } catch (e) {
      if (e.status === 400) error.value = 'Contraseña incorrecta'
      else if (e.status === 429) error.value = lockedMessage(e.details?.retryAfterMinutes)
      else error.value = e.message
      password.value = ''
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return { password, error, isSubmitting, submit }
}
