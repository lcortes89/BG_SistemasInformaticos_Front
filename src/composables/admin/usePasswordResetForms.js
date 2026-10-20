import { computed, reactive, ref } from 'vue'
import AuthService from '@/core/apis/auth/AuthService'
import { passwordRules } from '@/composables/admin/useChangePasswordForm'
import { useConfirmStep } from '@/composables/admin/useConfirmStep'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// BGSI-273: "¿Olvidaste tu contraseña?" -> ask for the email with the link
export function useForgotPasswordForm(service = new AuthService()) {
  const form = reactive({ email: '' })
  const errors = reactive({})
  const isSubmitting = ref(false)
  const isSent = ref(false)
  const submitError = ref(null)

  function validate() {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (!form.email.trim()) errors.email = 'El email es obligatorio'
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'El formato del email no es válido'
    return Object.keys(errors).length === 0
  }

  async function submit() {
    submitError.value = null
    if (!validate()) return false

    isSubmitting.value = true
    try {
      await service.forgotPassword(form.email)
      // Same message whether the email exists or not (the backend always answers 202)
      isSent.value = true
      return true
    } catch (e) {
      submitError.value = e.message
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { form, errors, isSubmitting, isSent, submitError, submit }
}

// BGSI-273: "Crea una nueva contraseña" with the token of the email link.
// Two steps (BGSI-294): 1) new password, 2) it is hidden and typed again
export function useResetPasswordForm(token, service = new AuthService()) {
  const form = reactive({ newPassword: '', confirmPassword: '' })
  const errors = reactive({})
  const isSubmitting = ref(false)
  const submitError = ref(null)
  // No token in the address = the link is broken
  const isInvalidLink = ref(!token)

  // Same rules as "Mi cuenta", except "different from the current one" (we do not know it here)
  const rules = computed(() => passwordRules(form.newPassword).filter((rule) => rule.key !== 'different'))

  function validateFirstStep() {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (!form.newPassword) errors.newPassword = 'Escribe la nueva contraseña'
    else if (rules.value.some((rule) => !rule.ok)) errors.newPassword = 'La nueva contraseña no cumple todos los requisitos'
    return Object.keys(errors).length === 0
  }

  // Everything (used when saving): the errors of both steps at once
  function validate() {
    validateFirstStep()
    if (!form.confirmPassword) errors.confirmPassword = 'Repite la nueva contraseña'
    else if (form.confirmPassword !== form.newPassword) errors.confirmPassword = 'Las contraseñas no coinciden'
    return Object.keys(errors).length === 0
  }

  const confirmStep = useConfirmStep({
    validateFirst: validateFirstStep,
    onBack: () => {
      form.confirmPassword = ''
      delete errors.confirmPassword
    },
  })

  async function submit() {
    submitError.value = null
    if (isInvalidLink.value || !validate()) return false

    isSubmitting.value = true
    try {
      await service.resetPassword(token, form.newPassword)
      return true
    } catch (e) {
      if (e.details?.newPassword) {
        confirmStep.back() // the error is shown next to the field of step 1
        errors.newPassword = 'La nueva contraseña no cumple todos los requisitos'
      }
      else if (e.status === 400) isInvalidLink.value = true // used, expired or invented link
      else submitError.value = e.message
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form, errors, rules, isSubmitting, submitError, isInvalidLink, submit,
    step: confirmStep.step, next: confirmStep.next, back: confirmStep.back,
  }
}
