import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ChangeEmailCard from '@/components/admin/ChangeEmailCard.vue'

const PENDING = { newEmail: 'new@bg.es', expiresAt: new Date(Date.now() + 3600e3) }

function fakeService(overrides = {}) {
  return {
    getPendingEmailChange: vi.fn().mockResolvedValue(null),
    requestEmailChange: vi.fn().mockResolvedValue(PENDING),
    cancelEmailChange: vi.fn().mockResolvedValue(),
    ...overrides,
  }
}

async function mountCard(service = fakeService()) {
  const wrapper = mount(ChangeEmailCard, { props: { currentEmail: 'me@bg.es', service } })
  await flushPromises()
  return wrapper
}

// BGSI-301: "Mi cuenta > Cambiar mi email"
describe('ChangeEmailCard', () => {
  it('asks for the new email, then to repeat it, and sends the link', async () => {
    const service = fakeService()
    const wrapper = await mountCard(service)

    await wrapper.find('#change-email-new').setValue('new@bg.es')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('#change-email-new').exists()).toBe(false)
    expect(wrapper.find('.admin-form__submit').text()).toBe('Enviar enlace')
    await wrapper.find('#change-email-confirm').setValue('new@bg.es')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(service.requestEmailChange).toHaveBeenCalledWith('new@bg.es')
    expect(wrapper.find('[data-test="pending-email"]').text()).toBe('new@bg.es')
    expect(wrapper.text()).toContain('Revisa tu correo nuevo')
    expect(wrapper.text()).toContain('Pendiente de confirmar')
    expect(wrapper.text()).toContain('sigues entrando con me@bg.es')
  })

  it('shows the error of the first step', async () => {
    const wrapper = await mountCard()

    await wrapper.find('#change-email-new').setValue('me@bg.es')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('.admin-form__error').text()).toBe('Es el email que ya usas')
  })

  it('blocks pasting the repeated email', async () => {
    const wrapper = await mountCard()
    await wrapper.find('#change-email-new').setValue('new@bg.es')
    await wrapper.find('form').trigger('submit')

    await wrapper.find('#change-email-confirm').trigger('paste')

    expect(wrapper.text()).toContain('Este campo no admite pegar')
  })

  it('shows the server error', async () => {
    const wrapper = await mountCard(fakeService({ requestEmailChange: vi.fn().mockRejectedValue({ status: 409 }) }))
    await wrapper.find('#change-email-new').setValue('new@bg.es')
    await wrapper.find('form').trigger('submit')
    await wrapper.find('#change-email-confirm').setValue('new@bg.es')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe('Ese email ya lo usa otro administrador')
  })

  it('cancels the pending change', async () => {
    const service = fakeService({ getPendingEmailChange: vi.fn().mockResolvedValue(PENDING) })
    const wrapper = await mountCard(service)
    expect(wrapper.text()).toContain('new@bg.es')

    await wrapper.find('[data-test="cancel"]').trigger('click')
    await flushPromises()

    expect(service.cancelEmailChange).toHaveBeenCalled()
    expect(wrapper.find('#change-email-new').exists()).toBe(true)
    expect(wrapper.text()).toContain('Cambio cancelado')
  })

  it('goes back to step 1 with "Atrás"', async () => {
    const wrapper = await mountCard()
    await wrapper.find('#change-email-new').setValue('new@bg.es')
    await wrapper.find('form').trigger('submit')

    await wrapper.find('[data-test="back"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('#change-email-new').element.value).toBe('new@bg.es')
  })

  // BGSI-314: on its own page the title is the one of the page
  it('without title, the head is only shown for the pending badge', async () => {
    const form = mount(ChangeEmailCard, { props: { currentEmail: 'me@bg.es', service: fakeService(), hideTitle: true } })
    await flushPromises()
    expect(form.find('h2').exists()).toBe(false)

    const pending = mount(ChangeEmailCard, {
      props: { currentEmail: 'me@bg.es', hideTitle: true, service: fakeService({ getPendingEmailChange: vi.fn().mockResolvedValue(PENDING) }) },
    })
    await flushPromises()
    expect(pending.find('h2').classes()).toContain('sr-only')
    expect(pending.text()).toContain('Pendiente de confirmar')
  })
})
