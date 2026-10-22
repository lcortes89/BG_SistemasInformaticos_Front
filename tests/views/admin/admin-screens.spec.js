import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { fakeApi, page } from '../../helpers/fake-api'
import { routes } from '@/router/routes'
import AdminContactsView from '@/views/admin/AdminContactsView.vue'
import AdminRatesView from '@/views/admin/AdminRatesView.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminSettingsView from '@/views/admin/AdminSettingsView.vue'
import AdminMailSettingsView from '@/views/admin/AdminMailSettingsView.vue'
import AdminUsersView from '@/views/admin/AdminUsersView.vue'
import AdminLayout from '@/views/admin/AdminLayout.vue'

// BGSI-266: the rest of the admin screens with a fake backend
const contactDto = {
  id: 4, name: 'Ana López', email: 'ana@mail.com', phone: '600123123', interestedService: 'BDP One',
  message: 'Quiero una demo', status: 'NEW', createdAt: '2026-10-12T15:30:00', note: null,
}
const questionDto = {
  id: 1, title: 'Negocio', question: '¿Qué tipo de negocio tienes?', hint: null, position: 0, active: true,
  options: [{ id: 1, icon: '🍽️', label: 'Restaurante', description: null, amount: '49.00', adjustmentType: 'BASE', position: 0 }],
}
const summary = {
  newContacts: 3, totalContacts: 12, activeBrands: 4, totalBrands: 5, featuredServices: 3, totalServices: 10,
  publishedClients: 2, totalClients: 3, latestContacts: [contactDto],
}

const buttonWithText = (wrapper, text) => wrapper.findAll('button').find((button) => button.text().includes(text))

async function mountWithRouter(view, stubs = {}) {
  setActivePinia(createPinia())
  const router = createRouter({ history: createMemoryHistory(), routes })
  router.push('/admin')
  await router.isReady()
  const wrapper = mount(view, { global: { plugins: [router], stubs }, attachTo: document.body })
  await flushPromises()
  return wrapper
}

describe('admin screens', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('Contactos: marks a new contact as contacted', async () => {
    const calls = fakeApi({
      'GET /admin/contacts': page([contactDto]),
      'PATCH /admin/contacts/4': (body) => ({ ...contactDto, ...body }),
    })
    const wrapper = await mountWithRouter(AdminContactsView)
    expect(wrapper.text()).toContain('Ana López')

    await buttonWithText(wrapper, 'Marcar contactado').trigger('click')
    await flushPromises()

    expect(calls.find((call) => call.key === 'PATCH /admin/contacts/4').body).toEqual({ status: 'CONTACTED' })
    expect(wrapper.find('[role="status"]').text()).toBe('Contacto marcado como contactado')
  })

  it('Contactos: asks before archiving a contact', async () => {
    const calls = fakeApi({
      'GET /admin/contacts': page([contactDto]),
      'PATCH /admin/contacts/4': (body) => ({ ...contactDto, ...body }),
    })
    const wrapper = await mountWithRouter(AdminContactsView)

    await buttonWithText(wrapper, 'Archivar').trigger('click')
    expect(calls.some((call) => call.key.startsWith('PATCH'))).toBe(false)
    await wrapper.find('.confirm-dialog__confirm').trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="status"]').text()).toBe('Contacto archivado')
  })

  it('Tarifas: shows the questions with their options and prices', async () => {
    fakeApi({ 'GET /admin/rate-questions': [questionDto] })
    const wrapper = await mountWithRouter(AdminRatesView)

    expect(wrapper.text()).toContain('¿Qué tipo de negocio tienes?')
    expect(wrapper.text()).toContain('Restaurante')
  })

  it('Tarifas: creates a new question at the end of the wizard', async () => {
    const calls = fakeApi({
      'GET /admin/rate-questions': [questionDto],
      'POST /admin/rate-questions': (body) => ({ ...questionDto, ...body, id: 2, position: 1, options: [] }),
    })
    const wrapper = await mountWithRouter(AdminRatesView)

    await buttonWithText(wrapper, '+ Nueva pregunta').trigger('click')
    await wrapper.find('#question-title').setValue('Locales')
    await wrapper.find('#question-text').setValue('¿Cuántos locales tienes?')
    await wrapper.find('form.admin-form').trigger('submit')
    await flushPromises()

    expect(calls.find((call) => call.key === 'POST /admin/rate-questions').body).toMatchObject({ title: 'Locales' })
    expect(wrapper.find('[role="status"]').text()).toBe('Pregunta creada al final del asistente')
  })

  it('Tarifas: asks before deleting a question', async () => {
    fakeApi({
      'GET /admin/rate-questions': [questionDto],
      'DELETE /admin/rate-questions/1': null,
    })
    const wrapper = await mountWithRouter(AdminRatesView)

    await buttonWithText(wrapper, 'Borrar pregunta').trigger('click')
    await wrapper.find('.confirm-dialog__confirm').trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="status"]').text()).toBe('Pregunta "Negocio" borrada')
  })

  it('Tarifas: adds an option to a question', async () => {
    const calls = fakeApi({
      'GET /admin/rate-questions': [questionDto],
      'POST /admin/rate-questions/1/options': (body) => ({ id: 2, position: 1, ...body }),
    })
    const wrapper = await mountWithRouter(AdminRatesView)

    await buttonWithText(wrapper, '+ Añadir opción').trigger('click')
    await wrapper.find('#option-icon').setValue('🛍️')
    await wrapper.find('#option-label').setValue('Tienda')
    await wrapper.find('#option-amount').setValue('39')
    await wrapper.find('form.admin-form').trigger('submit')
    await flushPromises()

    expect(calls.some((call) => call.key === 'POST /admin/rate-questions/1/options')).toBe(true)
    expect(wrapper.find('[role="status"]').text()).toBe('Tienda: opción añadida')
  })

  it('Resumen: shows the four counters and the latest contacts', async () => {
    fakeApi({ 'GET /admin/summary': summary })
    const wrapper = await mountWithRouter(AdminDashboardView)

    expect(wrapper.text()).toContain('Contactos nuevos')
    expect(wrapper.text()).toContain('de 12 en total')
    expect(wrapper.text()).toContain('Ana López')
  })

  // BGSI-297: "Ajustes" is split in two pages
  it('Foto de portada: shows only the hero photo', async () => {
    fakeApi({ 'GET /settings/hero': { imageUrl: null } })
    const wrapper = await mountWithRouter(AdminSettingsView)

    expect(wrapper.find('h1').text()).toBe('Foto de portada')
    expect(wrapper.text()).toContain('Foto original')
    expect(wrapper.find('#mail-notify-email').exists()).toBe(false)
  })

  it('Avisos por correo: shows only the email settings', async () => {
    fakeApi({
      'GET /admin/settings/mail': { notifyEmail: 'duenio@bg.es', senderName: 'BG Sistemas Web', senderAccount: 'web@gmail.com' },
    })
    const wrapper = await mountWithRouter(AdminMailSettingsView)

    expect(wrapper.find('h1').text()).toBe('Avisos por correo')
    expect(wrapper.find('#mail-notify-email').element.value).toBe('duenio@bg.es')
    expect(wrapper.text()).not.toContain('Foto original')
  })

  // BGSI-277: the list of admins and the invitation
  it('Administradores: lists the admins and invites a new one', async () => {
    const maria = { id: 2, email: 'maria@bg.es', status: 'ACTIVE', twoFactorEnabled: true, lastLoginAt: null, you: false }
    const nuevo = { id: 3, email: 'nuevo@bg.es', status: 'PENDING', twoFactorEnabled: false, lastLoginAt: null, you: false }
    let list = [maria]
    const calls = fakeApi({
      'GET /admin/users': () => list,
      'POST /admin/users/invitations': () => { list = [maria, nuevo]; return nuevo },
    })
    const wrapper = await mountWithRouter(AdminUsersView)
    expect(wrapper.find('h1').text()).toBe('Administradores')
    expect(wrapper.text()).toContain('1 administrador')

    await buttonWithText(wrapper, 'Invitar administrador').trigger('click')
    await wrapper.find('#invite-email').setValue('Nuevo@bg.es')
    await wrapper.find('.modal form').trigger('submit') // step 1 -> step 2 (BGSI-294)
    await wrapper.find('#invite-confirm-email').setValue('nuevo@bg.es')
    await wrapper.find('.modal form').trigger('submit')
    await flushPromises()

    expect(calls.find((call) => call.key === 'POST /admin/users/invitations').body).toEqual({ email: 'nuevo@bg.es' })
    expect(wrapper.find('.modal').exists()).toBe(false)
    expect(wrapper.find('[role="status"]').text()).toContain('Invitación enviada a nuevo@bg.es')
    expect(wrapper.find('[data-test="admin-3"]').text()).toContain('Pendiente')
  })

  it('Administradores: asks before blocking and then blocks', async () => {
    const maria = { id: 2, email: 'maria@bg.es', status: 'ACTIVE', twoFactorEnabled: false, lastLoginAt: null, you: false }
    let list = [maria]
    fakeApi({
      'GET /admin/users': () => list,
      'PUT /admin/users/2/block': () => { list = [{ ...maria, status: 'BLOCKED' }]; return list[0] },
    })
    const wrapper = await mountWithRouter(AdminUsersView)

    await buttonWithText(wrapper, 'Bloquear').trigger('click')
    expect(wrapper.find('.confirm-dialog').text()).toContain('maria@bg.es no podrá entrar al panel')
    await wrapper.find('.confirm-dialog__confirm').trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="status"]').text()).toBe('maria@bg.es está bloqueado. Ya no puede entrar al panel.')
    expect(wrapper.find('[data-test="admin-2"]').text()).toContain('Desbloquear')
  })

  it('Administradores: cancelling the question does nothing', async () => {
    const calls = fakeApi({
      'GET /admin/users': [{ id: 2, email: 'maria@bg.es', status: 'ACTIVE', twoFactorEnabled: false, lastLoginAt: null, you: false }],
    })
    const wrapper = await mountWithRouter(AdminUsersView)

    await buttonWithText(wrapper, 'Borrar').trigger('click')
    await wrapper.find('.confirm-dialog__cancel').trigger('click')

    expect(wrapper.find('.confirm-dialog').exists()).toBe(false)
    expect(calls.some((call) => call.key.startsWith('DELETE'))).toBe(false)
  })

  it('Layout: shows the menu of the panel and logs out', async () => {
    fakeApi({})
    // RouterView stubbed: the page inside the layout is tested on its own
    const wrapper = await mountWithRouter(AdminLayout, { RouterView: true })
    const titles = wrapper.findAll('.admin-layout__nav .admin-layout__label').map((title) => title.text())

    // BGSI-297: "Resumen" and the titles of the groups
    expect(titles).toEqual(['Resumen', 'Gestión de clientes', 'Gestión comercial', 'Gestión Administración', 'Ajustes de perfil'])
    const push = vi.spyOn(wrapper.vm.$router, 'push')
    await buttonWithText(wrapper, 'Cerrar sesión').trigger('click')
    expect(push).toHaveBeenCalledWith({ name: 'admin-login' })
  })
})
