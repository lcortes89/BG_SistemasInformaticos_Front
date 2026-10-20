import { reactive, ref } from 'vue'
import AuthService from '@/core/apis/auth/AuthService'
import { useConfirmStep } from '@/composables/admin/useConfirmStep'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD_LENGTH = 8 // same rule as the backend (RegisterRequestDTO)

const normalize = (email) => email.trim().toLowerCase()

// Form "Nuevo administrador" of the admin panel (BGSI-197). Two steps (BGSI-294):
// 1) email + password, 2) both are hidden and typed again (the email by hand, no paste)
export function useNewAdminForm(service = new AuthService()) {
  const form = reactive({ email: '', password: '', confirmEmail: '', confirmPassword: '' })
  const errors = reactive({})
  const isSubmitting = ref(false)
  const submitError = ref(null)
  const successMessage = ref(null)

  function validateFirstStep() {
    Object.keys(errors).forEach((key) => delete errors[key])
    submitError.value = null
    if (!form.email.trim()) errors.email = 'El email es obligatorio'
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'El formato del email no es válido'
    if (!form.password) errors.password = 'La contraseña es obligatoria'
    else if (form.password.length < MIN_PASSWORD_LENGTH) errors.password = `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`
    return Object.keys(errors).length === 0
  }

  // Everything (used when saving): the errors of both steps at once
  function validate() {
    validateFirstStep()
    if (!form.confirmEmail.trim()) errors.confirmEmail = 'Repite el email'
    else if (normalize(form.confirmEmail) !== normalize(form.email)) errors.confirmEmail = 'Los dos emails no coinciden'
    if (!form.confirmPassword) errors.confirmPassword = 'Repite la contraseña'
    else if (form.confirmPassword !== form.password) errors.confirmPassword = 'Las contraseñas no coinciden'
    return Object.keys(errors).length === 0
  }

  const confirmStep = useConfirmStep({
    validateFirst: validateFirstStep,
    onBack: () => {
      form.confirmEmail = ''
      form.confirmPassword = ''
      delete errors.confirmEmail
      delete errors.confirmPassword
    },
  })

  function reset() {
    form.email = ''
    form.password = ''
    form.confirmEmail = ''
    form.confirmPassword = ''
    confirmStep.reset()
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

  return {
    form, errors, isSubmitting, submitError, successMessage, submit,
    step: confirmStep.step, pasteBlocked: confirmStep.pasteBlocked,
    next: confirmStep.next, back: confirmStep.back, blockPaste: confirmStep.blockPaste,
  }
}
