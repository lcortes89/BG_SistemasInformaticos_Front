import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ContactForm from '@/components/contact/ContactForm.vue'
import { routes } from '@/router/routes'

function mountForm(contactService, services = []) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(ContactForm, { props: { contactService, services }, global: { plugins: [router] } })
}

async function fillValidForm(wrapper) {
  await wrapper.find('#contact-name').setValue('Ana López')
  await wrapper.find('#contact-email').setValue('ana@mail.com')
  await wrapper.find('#contact-message').setValue('Quiero una demo')
  await wrapper.find('#contact-gdpr').setValue(true)
}

describe('ContactForm', () => {
  it('shows validation errors and does not send when the form is empty', async () => {
    const fakeService = { send: vi.fn() }
    const wrapper = mountForm(fakeService)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('El nombre es obligatorio')
    expect(wrapper.text()).toContain('Debes aceptar la política de privacidad')
    expect(fakeService.send).not.toHaveBeenCalled()
  })

  it('links the GDPR checkbox to the privacy policy', () => {
    const wrapper = mountForm({ send: vi.fn() })

    expect(wrapper.find('a[href="/privacidad"]').exists()).toBe(true)
  })

  it('lists the services in the select', () => {
    const wrapper = mountForm({ send: vi.fn() }, [{ id: 2, name: 'BDP One', brandName: 'BDP' }])

    expect(wrapper.find('select').text()).toContain('BDP · BDP One')
  })

  it('disables the button while sending and shows success at the end', async () => {
    let resolveSend
    const fakeService = { send: vi.fn(() => new Promise((resolve) => { resolveSend = resolve })) }
    const wrapper = mountForm(fakeService)
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit')
    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.text()).toBe('Enviando...')

    resolveSend({ id: 1 })
    await flushPromises()

    expect(wrapper.find('[role="status"]').text()).toContain('Hemos recibido tu mensaje')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })
})
