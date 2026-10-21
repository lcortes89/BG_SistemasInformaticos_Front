import { ref } from 'vue'
import AccountService from '@/core/apis/account/AccountService'
import { lockedMessage } from '@/composables/admin/useLoginForm'

// BGSI-275: form of "Confirma tu contraseña". submit() returns { token, expiresInSeconds } or null.
// BGSI-276: with two-step verification the backend also asks for the code (needsCode)
export function useConfirmPasswordForm(service = new AccountService()) {
  const password = ref('')
  const code = ref('')
  const needsCode = ref(false)
  const error = ref(null)
  const codeError = ref(null)
  const isSubmitting = ref(false)

  async function submit() {
    error.value = null
    codeError.value = null
    if (!password.value) {
      error.value = 'Escribe tu contraseña'
      return null
    }
    if (needsCode.value && !code.value.trim()) {
      codeError.value = 'Escribe el código de tu app'
      return null
    }

    isSubmitting.value = true
    try {
      const result = await service.confirmPassword(password.value, needsCode.value ? code.value : null)
      password.value = ''
      code.value = ''
      return result
    } catch (e) {
      if (e.status === 400 && e.details?.code) {
        // The password was right: only the code is missing or wrong
        const first = !needsCode.value
        needsCode.value = true
        code.value = ''
        codeError.value = first ? null : 'Código incorrecto'
        return null
      }
      if (e.status === 400) error.value = 'Contraseña incorrecta'
      else if (e.status === 429) error.value = lockedMessage(e.details?.retryAfterMinutes)
      else error.value = e.message
      password.value = ''
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return { password, code, needsCode, error, codeError, isSubmitting, submit }
}
