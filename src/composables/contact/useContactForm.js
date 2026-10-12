import { reactive, ref } from 'vue'
import ContactService from '@/core/apis/contact/ContactService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emptyForm = () => ({
  name: '',
  email: '',
  phone: '',
  interestedService: '',
  message: '',
  gdprConsent: false,
})

export function useContactForm(service = new ContactService()) {
  const form = reactive(emptyForm())
  const errors = reactive({})
  const isSubmitting = ref(false)
  const isSuccess = ref(false)
  const submitError = ref(null)

  function clearErrors() {
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  // Same rules as the backend (ContactRequestDTO), checked before sending
  function validate() {
    clearErrors()
    if (!form.name.trim()) errors.name = 'El nombre es obligatorio'
    else if (form.name.length > 100) errors.name = 'El nombre no puede superar los 100 caracteres'

    if (!form.email.trim()) errors.email = 'El email es obligatorio'
    else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'El formato del email no es válido'

    if (form.phone.length > 20) errors.phone = 'El teléfono no puede superar los 20 caracteres'

    if (!form.message.trim()) errors.message = 'El mensaje es obligatorio'
    else if (form.message.length > 2000) errors.message = 'El mensaje no puede superar los 2000 caracteres'

    if (!form.gdprConsent) errors.gdprConsent = 'Debes aceptar la política de privacidad'

    return Object.keys(errors).length === 0
  }

  async function submit() {
    isSuccess.value = false
    submitError.value = null
    if (!validate()) return false

    isSubmitting.value = true
    try {
      await service.send(form)
      isSuccess.value = true
      Object.assign(form, emptyForm())
      return true
    } catch (e) {
      // Field errors sent by the backend (ApiErrorDTO.details) appear next to each field
      if (e.details) Object.assign(errors, e.details)
      submitError.value = e.message
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { form, errors, isSubmitting, isSuccess, submitError, submit }
}
