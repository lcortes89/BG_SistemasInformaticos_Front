import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// BGSI-284: 429 after 5 wrong passwords. The backend sends the minutes left in details.retryAfterMinutes
export function lockedMessage(minutes) {
  const value = Number.parseInt(minutes, 10)
  if (!value) return 'Demasiados intentos fallidos. Espera unos minutos y vuelve a intentarlo.'
  return `Demasiados intentos fallidos. Vuelve a intentarlo en ${value} ${value === 1 ? 'minuto' : 'minutos'}.`
}

export function useLoginForm(authStore = useAuthStore()) {
  const form = reactive({ email: '', password: '' })
  const errors = reactive({})
  const isSubmitting = ref(false)
  const submitError = ref(null)

  function validate() {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (!form.email.trim()) errors.email = 'El email es obligatorio'
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'El formato del email no es válido'
    if (!form.password) errors.password = 'La contraseña es obligatoria'
    return Object.keys(errors).length === 0
  }

  async function submit() {
    submitError.value = null
    if (!validate()) return false

    isSubmitting.value = true
    try {
      await authStore.login(form.email, form.password)
      form.password = ''
      return true
    } catch (e) {
      // 401: wrong credentials. We never say which of the two fields failed (security)
      if (e.status === 401) submitError.value = 'Email o contraseña incorrectos'
      else if (e.status === 429) submitError.value = lockedMessage(e.details?.retryAfterMinutes)
      else submitError.value = e.message
      form.password = ''
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { form, errors, isSubmitting, submitError, submit }
}
