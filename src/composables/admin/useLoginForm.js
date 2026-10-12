import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
      submitError.value = e.status === 401 ? 'Email o contraseña incorrectos' : e.message
      form.password = ''
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { form, errors, isSubmitting, submitError, submit }
}
