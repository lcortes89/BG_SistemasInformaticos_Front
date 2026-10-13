import { reactive, ref } from 'vue'
import ContactService from '@/core/apis/contact/ContactService'
import { buildRateSummary } from '@/core/models/rate/rate-summary'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const RATE_PROPOSAL_SERVICE = 'Calculadora de tarifas'

const emptyForm = () => ({ name: '', email: '', phone: '', comment: '', gdprConsent: false })

// Short form under the price: the answers travel with it, the visitor writes nothing again
export function useRateProposal(service = new ContactService()) {
  const form = reactive(emptyForm())
  const errors = reactive({})
  const isSubmitting = ref(false)
  const isSuccess = ref(false)
  const submitError = ref(null)

  function validate() {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (!form.name.trim()) errors.name = 'El nombre es obligatorio'
    else if (form.name.length > 100) errors.name = 'El nombre no puede superar los 100 caracteres'

    if (!form.email.trim()) errors.email = 'El email es obligatorio'
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'El formato del email no es válido'

    if (form.phone.length > 20) errors.phone = 'El teléfono no puede superar los 20 caracteres'
    if (form.comment.length > 1000) errors.comment = 'El comentario no puede superar los 1000 caracteres'
    if (!form.gdprConsent) errors.gdprConsent = 'Debes aceptar la política de privacidad'

    return Object.keys(errors).length === 0
  }

  async function submit(answers, quote) {
    submitError.value = null
    if (!validate()) return false

    isSubmitting.value = true
    try {
      await service.send({
        name: form.name,
        email: form.email,
        phone: form.phone,
        interestedService: RATE_PROPOSAL_SERVICE,
        message: buildRateSummary(answers, quote, form.comment),
        gdprConsent: form.gdprConsent,
      })
      isSuccess.value = true
      Object.assign(form, emptyForm())
      return true
    } catch (e) {
      if (e.details) Object.assign(errors, e.details)
      submitError.value = e.message
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { form, errors, isSubmitting, isSuccess, submitError, submit }
}
