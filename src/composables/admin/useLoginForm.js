import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// BGSI-284: 429 after 5 wrong passwords. The backend sends the minutes left in details.retryAfterMinutes
export function lockedMessage(minutes) {
  const value = Number.parseInt(minutes, 10)
  if (!value) return 'Demasiados intentos fallidos. Espera unos minutos y vuelve a intentarlo.'
  return `Demasiados intentos fallidos. Vuelve a intentarlo en ${value} ${value === 1 ? 'minuto' : 'minutos'}.`
}

const EXPIRED_MESSAGE = 'Han pasado más de 5 minutos. Vuelve a escribir tu contraseña.'

export function useLoginForm(authStore = useAuthStore()) {
  const form = reactive({ email: '', password: '', code: '' })
  const errors = reactive({})
  const isSubmitting = ref(false)
  const submitError = ref(null)
  // BGSI-276: 'password' -> 'code' when the admin has two-step verification
  const step = ref('password')
  const useRecoveryCode = ref(false)
  let pendingToken = null

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
      const result = await authStore.login(form.email, form.password)
      form.password = ''
      if (result?.twoFactorRequired) {
        pendingToken = result.pendingToken
        form.code = ''
        step.value = 'code'
        return false
      }
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

  // BGSI-276: second step. Returns true when the admin is in
  async function submitCode() {
    submitError.value = null
    delete errors.code
    if (!form.code.trim()) {
      errors.code = useRecoveryCode.value ? 'Escribe un código de recuperación' : 'Escribe el código de 6 cifras'
      return false
    }

    isSubmitting.value = true
    try {
      await authStore.verifyTwoFactor(pendingToken, form.code)
      pendingToken = null
      return true
    } catch (e) {
      form.code = ''
      if (e.status === 400 && e.details?.code) {
        errors.code = 'Código incorrecto. Comprueba que es el último que muestra la app.'
      } else if (e.status === 429) {
        backToPassword(lockedMessage(e.details?.retryAfterMinutes))
      } else if (e.status === 400) {
        backToPassword(EXPIRED_MESSAGE) // the 5 minutes of the pending login are over
      } else {
        submitError.value = e.message
      }
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  function backToPassword(message = null) {
    pendingToken = null
    form.code = ''
    useRecoveryCode.value = false
    delete errors.code
    step.value = 'password'
    submitError.value = message
  }

  function toggleRecoveryCode() {
    useRecoveryCode.value = !useRecoveryCode.value
    form.code = ''
    delete errors.code
  }

  return {
    form, errors, isSubmitting, submitError, submit,
    step, useRecoveryCode, submitCode, backToPassword, toggleRecoveryCode,
  }
}
