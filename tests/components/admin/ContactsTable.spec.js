import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactsTable from '@/components/admin/ContactsTable.vue'
import ContactModel from '@/core/models/contact/ContactModel'
import { chooseRowAction, rowActionLabels } from '../../helpers/row-actions'

const newContact = new ContactModel(1, 'Ana López', 'NEW', '2026-10-12T15:30:00', 'ana@mail.com', '600123123', 'BDP One', 'Quiero una demo')
const archivedContact = new ContactModel(2, 'Luis Pérez', 'ARCHIVED', '2026-10-11T10:00:00', 'luis@mail.com', null, null, 'Hola', 'Ya es cliente')

describe('ContactsTable', () => {
  it('shows one row per contact with its translated status and its note', () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [newContact, archivedContact] } })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('Nuevo')
    expect(wrapper.text()).toContain('Archivado')
    expect(wrapper.text()).toContain('Nota: Ya es cliente')
    expect(wrapper.find('a[href="mailto:ana@mail.com"]').exists()).toBe(true)
  })

  // BGSI-312: name, email and phone in one column; the message can be opened
  it('shows the name with the email and the message in an expandable text', () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [newContact] } })

    const who = wrapper.find('[data-label="Contacto"]').text()
    expect(who).toContain('Ana López')
    expect(who).toContain('ana@mail.com')
    expect(who).toContain('600123123')
    expect(wrapper.find('.expandable-text').text()).toContain('Quiero una demo')
  })

  it('shows an empty state when there are no contacts', () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [] } })

    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('No hay contactos con este estado.')
  })

  it('offers the right actions in the "⋯" menu and emits them', async () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [newContact] } })

    expect(await rowActionLabels(wrapper)).toEqual(['Marcar contactado', 'Añadir nota', 'Archivar', 'Borrar'])
    await chooseRowAction(wrapper, 'Marcar contactado')
    await chooseRowAction(wrapper, 'Archivar')
    await chooseRowAction(wrapper, 'Añadir nota')
    await chooseRowAction(wrapper, 'Borrar')

    expect(wrapper.emitted('change-status')[0]).toEqual([newContact, 'CONTACTED'])
    expect(wrapper.emitted('change-status')[1]).toEqual([newContact, 'ARCHIVED'])
    expect(wrapper.emitted('edit-note')[0]).toEqual([newContact])
    expect(wrapper.emitted('delete')[0]).toEqual([newContact]) // BGSI-308
  })

  it('lets an archived contact be restored', async () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [archivedContact] } })

    expect(await rowActionLabels(wrapper)).toEqual(['Editar nota', 'Restaurar', 'Borrar'])
    await chooseRowAction(wrapper, 'Restaurar')

    expect(wrapper.emitted('change-status')[0]).toEqual([archivedContact, 'NEW'])
  })

  it('names the menu of each row for screen readers', () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [newContact] } })

    expect(wrapper.find('[data-test="row-actions"]').attributes('aria-label')).toBe('Acciones de Ana López')
  })
})
