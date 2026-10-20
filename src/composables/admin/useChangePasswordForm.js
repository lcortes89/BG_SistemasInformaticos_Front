import { computed, reactive, ref } from 'vue'
import AccountService from '@/core/apis/account/AccountService'
import { useAuthStore } from '@/stores/auth'

// Same rules as the backend (ChangePasswordRequestDTO): 10-72 characters, upper, lower and number
export const MIN_LENGTH = 10
export const MAX_LENGTH = 72

export function passwordRules(password, currentPassword = '') {
  return [
    { key: 'length', label: `Entre ${MIN_LENGTH} y ${MAX_LENGTH} caracteres`, ok: password.length >= MIN_LENGTH && password.length <= MAX_LENGTH },
    { key: 'upper', label: 'Una letra mayúscula', ok: /[A-Z]/.test(password) },
    { key: 'lower', label: 'Una letra minúscula', ok: /[a-z]/.test(password) },
    { key: 'number', label: 'Un número', ok: /\d/.test(password) },
    { key: 'different', label: 'Distinta de la actual', ok: password.length > 0 && password !== currentPassword },
  ]
}

// "Mi cuenta → Cambiar contraseña" (BGSI-272)
export function useChangePasswordForm(service = new AccountService(), authStore = useAuthStore()) {
  const form = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const errors = reactive({})
  const isSubmitting = ref(false)
  const submitError = ref(null)
  const successMessage = ref(null)

  const rules = computed(() => passwordRules(form.newPassword, form.currentPassword))

  function validate() {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (!form.currentPassword) errors.currentPassword = 'Escribe tu contraseña actual'
    if (!form.newPassword) errors.newPassword = 'Escribe la nueva contraseña'
    else if (rules.value.some((rule) => !rule.ok)) errors.newPassword = 'La nueva contraseña no cumple todos los requisitos'
    if (!form.confirmPassword) errors.confirmPassword = 'Repite la nueva contraseña'
    else if (form.confirmPassword !== form.newPassword) errors.confirmPassword = 'Las contraseñas no coinciden'
    return Object.keys(errors).length === 0
  }

  function reset() {
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  }

  async function submit() {
    submitError.value = null
    successMessage.value = null
    if (!validate()) return false

    isSubmitting.value = true
    try {
      const token = await service.changePassword(form.currentPassword, form.newPassword)
      authStore.replaceToken(token) // this tab keeps working, the other sessions are closed
      successMessage.value = 'Contraseña actualizada. Se ha cerrado la sesión en tus otros dispositivos.'
      reset()
      return true
    } catch (e) {
      // The backend says which field failed (details.currentPassword / details.newPassword)
      if (e.details?.currentPassword) errors.currentPassword = 'La contraseña actual no es correcta'
      else if (e.details?.newPassword) errors.newPassword = 'La nueva contraseña no es válida o es igual a la actual'
      else submitError.value = e.message
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { form, errors, rules, isSubmitting, submitError, successMessage, submit }
}
