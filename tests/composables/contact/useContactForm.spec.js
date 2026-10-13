import { describe, it, expect, vi } from 'vitest'
import { useContactForm } from '@/composables/contact/useContactForm'

function fillValidForm(form) {
  form.name = 'Ana López'
  form.email = 'ana@mail.com'
  form.message = 'Quiero una demo'
  form.gdprConsent = true
}

describe('useContactForm', () => {
  it('does not send and shows errors when required fields are empty', async () => {
    const fakeService = { send: vi.fn() }
    const { errors, submit } = useContactForm(fakeService)

    const sent = await submit()

    expect(sent).toBe(false)
    expect(fakeService.send).not.toHaveBeenCalled()
    expect(Object.keys(errors)).toEqual(['name', 'email', 'message', 'gdprConsent'])
  })

  it('rejects an invalid email', async () => {
    const { form, errors, submit } = useContactForm({ send: vi.fn() })
    fillValidForm(form)
    form.email = 'not-an-email'

    await submit()

    expect(errors.email).toBe('El formato del email no es válido')
  })

  it('sends the form, shows success and resets the fields', async () => {
    const fakeService = { send: vi.fn().mockResolvedValue({ id: 1 }) }
    const { form, isSuccess, isSubmitting, submit } = useContactForm(fakeService)
    fillValidForm(form)

    const sent = await submit()

    expect(sent).toBe(true)
    expect(fakeService.send).toHaveBeenCalled()
    expect(isSuccess.value).toBe(true)
    expect(isSubmitting.value).toBe(false)
    expect(form.name).toBe('')
    expect(form.gdprConsent).toBe(false)
  })

  it('shows the backend error message and field details', async () => {
    const backendError = Object.assign(new Error('Some fields are not valid'), { details: { email: 'Email format is not valid' } })
    const fakeService = { send: vi.fn().mockRejectedValue(backendError) }
    const { form, errors, submitError, submit } = useContactForm(fakeService)
    fillValidForm(form)

    await submit()

    expect(submitError.value).toBe('Some fields are not valid')
    expect(errors.email).toBe('Email format is not valid')
  })
})

describe('useContactForm with initial values', () => {
  it('starts with the message already written', () => {
    const { form } = useContactForm({ send: () => {} }, { message: 'Quiero una demo' })

    expect(form.message).toBe('Quiero una demo')
    expect(form.name).toBe('')
  })
})
