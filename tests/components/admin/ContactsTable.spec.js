import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactsTable from '@/components/admin/ContactsTable.vue'
import ContactModel from '@/core/models/contact/ContactModel'

const newContact = new ContactModel(1, 'Ana López', 'NEW', '2026-10-12T15:30:00', 'ana@mail.com', '600123123', 'BDP One', 'Quiero una demo')
const archivedContact = new ContactModel(2, 'Luis Pérez', 'ARCHIVED', '2026-10-11T10:00:00', 'luis@mail.com', null, null, 'Hola', 'Ya es cliente')

function buttonWithText(wrapper, text) {
  return wrapper.findAll('button').find((button) => button.text() === text)
}

describe('ContactsTable', () => {
  it('shows one row per contact with its translated status and its note', () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [newContact, archivedContact] } })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('Nuevo')
    expect(wrapper.text()).toContain('Archivado')
    expect(wrapper.text()).toContain('Nota: Ya es cliente')
    expect(wrapper.find('a[href="mailto:ana@mail.com"]').exists()).toBe(true)
  })

  it('shows an empty state when there are no contacts', () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [] } })

    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('No hay contactos con este estado.')
  })

  it('offers the right actions and emits them', async () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [newContact] } })

    await buttonWithText(wrapper, 'Marcar contactado').trigger('click')
    await buttonWithText(wrapper, 'Archivar').trigger('click')
    await buttonWithText(wrapper, 'Añadir nota').trigger('click')

    expect(wrapper.emitted('change-status')[0]).toEqual([newContact, 'CONTACTED'])
    expect(wrapper.emitted('change-status')[1]).toEqual([newContact, 'ARCHIVED'])
    expect(wrapper.emitted('edit-note')[0]).toEqual([newContact])
  })

  it('lets an archived contact be restored', async () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [archivedContact] } })

    expect(buttonWithText(wrapper, 'Archivar')).toBeUndefined()
    await buttonWithText(wrapper, 'Restaurar').trigger('click')

    expect(wrapper.emitted('change-status')[0]).toEqual([archivedContact, 'NEW'])
  })
})
