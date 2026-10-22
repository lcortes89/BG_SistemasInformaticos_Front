import { reactive, ref } from 'vue'
import AccountService from '@/core/apis/account/AccountService'
import { useConfirmStep } from '@/composables/admin/useConfirmStep'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalize = (email) => email.trim().toLowerCase()

// BGSI-301: "Mi cuenta > Cambiar mi email".
// view: 'loading' | 'form' | 'pending' (the link was sent to the new email and is waiting)
// Two steps (BGSI-294): 1) the new email, 2) it is hidden and typed again by hand.
// The email only changes when the link of the email is opened (AdminConfirmEmailView)
export function useEmailChange(service = new AccountService(), currentEmail = () => '') {
  const view = ref('loading')
  const pending = ref(null) // { newEmail, expiresAt }
  const form = reactive({ newEmail: '', confirmEmail: '' })
  const errors = reactive({})
  const isBusy = ref(false)
  const submitError = ref(null)
  const feedback = ref(null)

  function clearErrors() {
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  function validateFirstStep() {
    clearErrors()
    submitError.value = null
    const email = form.newEmail.trim()
    if (!email) errors.newEmail = 'Escribe el email nuevo'
    else if (!EMAIL_PATTERN.test(email)) errors.newEmail = 'El formato del email no es válido'
    else if (normalize(email) === normalize(currentEmail() ?? '')) errors.newEmail = 'Es el email que ya usas'
    return Object.keys(errors).length === 0
  }

  // Everything (used when sending): the errors of both steps at once
  function validate() {
    validateFirstStep()
    if (!form.confirmEmail.trim()) errors.confirmEmail = 'Repite el email nuevo'
    else if (normalize(form.confirmEmail) !== normalize(form.newEmail)) errors.confirmEmail = 'Los dos emails no coinciden'
    return Object.keys(errors).length === 0
  }

  const confirmStep = useConfirmStep({
    validateFirst: validateFirstStep,
    onBack: () => {
      form.confirmEmail = ''
      delete errors.confirmEmail
    },
  })

  function resetForm() {
    form.newEmail = ''
    form.confirmEmail = ''
    clearErrors()
    submitError.value = null
    confirmStep.reset()
  }

  async function load() {
    try {
      pending.value = await service.getPendingEmailChange()
    } catch {
      pending.value = null // the form still works
    }
    view.value = pending.value ? 'pending' : 'form'
  }

  // Needs the password: the interceptor opens "Confirma tu contraseña" (BGSI-275)
  async function submit() {
    feedback.value = null
    submitError.value = null
    if (!validate()) return false

    isBusy.value = true
    try {
      pending.value = await service.requestEmailChange(form.newEmail)
      resetForm()
      view.value = 'pending'
      return true
    } catch (e) {
      if (e.cancelled) return false // dialog closed: the form is kept
      if (e.status === 409) submitError.value = 'Ese email ya lo usa otro administrador'
      else if (e.details?.newEmail) submitError.value = 'El formato del email no es válido'
      else if (e.status === 400) submitError.value = 'Es el email que ya usas'
      else submitError.value = e.message
      return false
    } finally {
      isBusy.value = false
    }
  }

  // The link that was sent stops working
  async function cancel() {
    feedback.value = null
    submitError.value = null
    isBusy.value = true
    try {
      await service.cancelEmailChange()
      pending.value = null
      view.value = 'form'
      feedback.value = 'Cambio cancelado. El enlace que te enviamos ya no sirve.'
    } catch (e) {
      submitError.value = e.message
    } finally {
      isBusy.value = false
    }
  }

  return {
    view, pending, form, errors, isBusy, submitError, feedback,
    load, submit, cancel,
    step: confirmStep.step, pasteBlocked: confirmStep.pasteBlocked,
    next: confirmStep.next, back: confirmStep.back, blockPaste: confirmStep.blockPaste,
  }
}

// "antes de las 15:42" (today) or "antes del 23/10 a las 00:15"
export function expiryText(date, now = new Date()) {
  const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  if (date.toDateString() === now.toDateString()) return `antes de las ${time}`
  const day = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
  return `antes del ${day} a las ${time}`
}
