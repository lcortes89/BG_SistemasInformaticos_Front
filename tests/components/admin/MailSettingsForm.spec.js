import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MailSettingsForm from '@/components/admin/MailSettingsForm.vue'

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

async function mountForm(service = fakeService()) {
  const wrapper = mount(MailSettingsForm, { props: { service } })
  await flushPromises()
  return wrapper
}

const saveButton = (wrapper) => wrapper.find('button[type="submit"]')

describe('MailSettingsForm (BGSI-261)', () => {
  it('shows the saved settings and the account that sends the emails', async () => {
    const wrapper = await mountForm()

    expect(wrapper.find('#mail-notify-email').element.value).toBe('duenio@bg.es')
    expect(wrapper.find('#mail-sender-name').element.value).toBe('BG Sistemas Web')
    expect(wrapper.text()).toContain('web@gmail.com')
    expect(wrapper.find('#mail-confirm-email').exists()).toBe(false)
    expect(saveButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('asks to repeat the email when it changes and shows when they do not match', async () => {
    const wrapper = await mountForm()

    await wrapper.find('#mail-notify-email').setValue('nuevo@bg.es')
    expect(wrapper.find('#mail-confirm-email').exists()).toBe(true)

    await wrapper.find('#mail-confirm-email').setValue('nuevo@bg.e')
    expect(wrapper.find('[role="alert"]').text()).toBe('Los dos emails no coinciden.')
    expect(saveButton(wrapper).attributes('disabled')).toBeDefined()

    await wrapper.find('#mail-confirm-email').setValue('nuevo@bg.es')
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(saveButton(wrapper).attributes('disabled')).toBeUndefined()
  })

  it('does not let you paste or drop text in the confirmation field', async () => {
    const wrapper = await mountForm()
    await wrapper.find('#mail-notify-email').setValue('nuevo@bg.es')
    const confirm = wrapper.find('#mail-confirm-email').element

    const paste = new Event('paste', { cancelable: true })
    const drop = new Event('drop', { cancelable: true })
    confirm.dispatchEvent(paste)
    confirm.dispatchEvent(drop)

    expect(paste.defaultPrevented).toBe(true)
    expect(drop.defaultPrevented).toBe(true)
  })

  it('saves the new email and shows where the next emails will go', async () => {
    const service = fakeService()
    const wrapper = await mountForm(service)

    await wrapper.find('#mail-notify-email').setValue('nuevo@bg.es')
    await wrapper.find('#mail-confirm-email').setValue('nuevo@bg.es')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(service.updateMailSettings).toHaveBeenCalled()
    expect(wrapper.find('[role="status"]').text()).toContain('nuevo@bg.es')
    expect(wrapper.find('#mail-confirm-email').exists()).toBe(false)
  })

  it('sends a test email, but only when there are no unsaved changes', async () => {
    const service = fakeService()
    const wrapper = await mountForm(service)
    const testButton = () => wrapper.find('.mail-settings__test')

    await wrapper.find('#mail-sender-name').setValue('Web de BG')
    expect(testButton().attributes('disabled')).toBeDefined()

    await wrapper.find('#mail-sender-name').setValue('BG Sistemas Web')
    await testButton().trigger('click')
    await flushPromises()

    expect(service.sendTestMail).toHaveBeenCalled()
    expect(wrapper.find('[role="status"]').text()).toContain('Correo de prueba enviado a duenio@bg.es')
  })
})
