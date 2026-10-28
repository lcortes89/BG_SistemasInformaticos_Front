import { reactive, ref } from 'vue'
import AdminUserService from '@/core/apis/adminuser/AdminUserService'
import { useConfirmStep } from '@/composables/admin/useConfirmStep'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalize = (email) => email.trim().toLowerCase()

// "Invitar administrador" (BGSI-277). Two steps (BGSI-294): 1) the email, 2) it is hidden and typed again by hand.
// The new admin gets an email and chooses the password: nobody else knows it
export function useInviteAdminForm(service = new AdminUserService()) {
  const form = reactive({ email: '', confirmEmail: '' })
  const errors = reactive({})
  const isSubmitting = ref(false)
  const submitError = ref(null)

  function validateFirstStep() {
    Object.keys(errors).forEach((key) => delete errors[key])
    submitError.value = null
    if (!form.email.trim()) errors.email = 'El email es obligatorio'
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'El formato del email no es válido'
    return Object.keys(errors).length === 0
  }

  // Everything (used when sending): the errors of both steps at once
  function validate() {
    validateFirstStep()
    if (!form.confirmEmail.trim()) errors.confirmEmail = 'Repite el email'
    else if (normalize(form.confirmEmail) !== normalize(form.email)) errors.confirmEmail = 'Los dos emails no coinciden'
    return Object.keys(errors).length === 0
  }

  const confirmStep = useConfirmStep({
    validateFirst: validateFirstStep,
    onBack: () => {
      form.confirmEmail = ''
      delete errors.confirmEmail
    },
  })

  function reset() {
    form.email = ''
    form.confirmEmail = ''
    Object.keys(errors).forEach((key) => delete errors[key])
    submitError.value = null
    confirmStep.reset()
  }

  // Returns the invited email, or null if it was not sent
  async function submit() {
    submitError.value = null
    if (!validate()) return null

    isSubmitting.value = true
    try {
      const admin = await service.invite(form.email)
      reset()
      return admin.email
    } catch (e) {
      if (e.cancelled) submitError.value = null // BGSI-275: password dialog closed, the form is kept
      else if (e.status === 409) submitError.value = 'Ya existe un administrador con ese email'
      else if (e.details?.email) submitError.value = 'El formato del email no es válido'
      else submitError.value = e.message
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form, errors, isSubmitting, submitError, submit, reset,
    step: confirmStep.step, pasteBlocked: confirmStep.pasteBlocked,
    next: confirmStep.next, back: confirmStep.back, blockPaste: confirmStep.blockPaste,
  }
}
