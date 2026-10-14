import { reactive, ref } from 'vue'
import AuthService from '@/core/apis/auth/AuthService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD_LENGTH = 8 // same rule as the backend (RegisterRequestDTO)

// Form "Nuevo administrador" of the admin panel (BGSI-197)
export function useNewAdminForm(service = new AuthService()) {
  const form = reactive({ email: '', password: '', confirmPassword: '' })
  const errors = reactive({})
  const isSubmitting = ref(false)
  const submitError = ref(null)
  const successMessage = ref(null)

  function validate() {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (!form.email.trim()) errors.email = 'El email es obligatorio'
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'El formato del email no es válido'
    if (!form.password) errors.password = 'La contraseña es obligatoria'
    else if (form.password.length < MIN_PASSWORD_LENGTH) errors.password = `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`
    if (!form.confirmPassword) errors.confirmPassword = 'Repite la contraseña'
    else if (form.confirmPassword !== form.password) errors.confirmPassword = 'Las contraseñas no coinciden'
    return Object.keys(errors).length === 0
  }

  function reset() {
    form.email = ''
    form.password = ''
    form.confirmPassword = ''
  }

  async function submit() {
    submitError.value = null
    successMessage.value = null
    if (!validate()) return false

    isSubmitting.value = true
    try {
      const email = await service.registerAdmin(form.email, form.password)
      successMessage.value = `Administrador ${email} creado. Ya puede iniciar sesión.`
      reset()
      return true
    } catch (e) {
      submitError.value = e.status === 409 ? 'Ya existe un administrador con ese email' : e.message
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { form, errors, isSubmitting, submitError, successMessage, submit }
}
