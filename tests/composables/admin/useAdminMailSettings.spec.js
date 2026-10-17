import { describe, it, expect, vi } from 'vitest'
import { useAdminMailSettings } from '@/composables/admin/useAdminMailSettings'

const settings = { notifyEmail: 'duenio@bg.es', senderName: 'BG Sistemas Web', senderAccount: 'web@gmail.com' }

function fakeService() {
  return {
    getMailSettings: vi.fn().mockResolvedValue(settings),
    updateMailSettings: vi.fn().mockImplementation(async (form) => ({
      notifyEmail: form.notifyEmail.trim(), senderName: form.senderName.trim(), senderAccount: 'web@gmail.com',
    })),
    sendTestMail: vi.fn().mockResolvedValue(),
  }
}

async function loaded(service = fakeService()) {
  const mail = useAdminMailSettings(service)
  await mail.load()
  return mail
}

describe('useAdminMailSettings (BGSI-261)', () => {
  it('fills the form with the saved settings and has nothing to save', async () => {
    const { form, hasChanges, emailChanged, canSave } = await loaded()

    expect(form.notifyEmail).toBe('duenio@bg.es')
    expect(form.senderName).toBe('BG Sistemas Web')
    expect(emailChanged.value).toBe(false)
    expect(hasChanges.value).toBe(false)
    expect(canSave.value).toBe(false)
  })

  it('asks to repeat a new email and cannot save while they are different', async () => {
    const { form, emailChanged, confirmError, canSave } = await loaded()

    form.notifyEmail = 'nuevo@bg.es'
    expect(emailChanged.value).toBe(true)
    expect(canSave.value).toBe(false)
    expect(confirmError.value).toBeNull() // nothing typed yet

    form.confirmEmail = 'nuevo@bg.e'
    expect(confirmError.value).toBe('Los dos emails no coinciden.')
    expect(canSave.value).toBe(false)

    form.confirmEmail = 'NUEVO@bg.es' // upper or lower case does not matter
    expect(confirmError.value).toBeNull()
    expect(canSave.value).toBe(true)
  })

  it('changing only the sender name does not need the confirmation', async () => {
    const { form, emailChanged, canSave } = await loaded()

    form.senderName = 'Web de BG'

    expect(emailChanged.value).toBe(false)
    expect(canSave.value).toBe(true)
  })

  it('does not save an email with a wrong format', async () => {
    const service = fakeService()
    const { form, error, save } = await loaded(service)

    form.notifyEmail = 'nuevo@bg'
    form.confirmEmail = 'nuevo@bg'

    expect(await save()).toBe(false)
    expect(error.value).toBe('El formato del email no es válido')
    expect(service.updateMailSettings).not.toHaveBeenCalled()
  })

  it('saves the new email, clears the confirmation and says where the emails will go', async () => {
    const service = fakeService()
    const { form, feedback, emailChanged, save } = await loaded(service)

    form.notifyEmail = 'nuevo@bg.es'
    form.confirmEmail = 'nuevo@bg.es'

    expect(await save()).toBe(true)
    expect(service.updateMailSettings).toHaveBeenCalled()
    expect(form.confirmEmail).toBe('')
    expect(emailChanged.value).toBe(false)
    expect(feedback.value).toContain('nuevo@bg.es')
  })

  it('sends the test email to the saved address', async () => {
    const service = fakeService()
    const { feedback, sendTest } = await loaded(service)

    expect(await sendTest()).toBe(true)
    expect(service.sendTestMail).toHaveBeenCalled()
    expect(feedback.value).toContain('duenio@bg.es')
  })

  it('explains in Spanish when the test email fails', async () => {
    const service = fakeService()
    service.sendTestMail.mockRejectedValue(new Error('Ha ocurrido un error en el servidor.'))
    const { error, sendTest } = await loaded(service)

    expect(await sendTest()).toBe(false)
    expect(error.value).toContain('No se pudo enviar el correo de prueba')
  })
})
