import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactsTable from '@/components/admin/ContactsTable.vue'
import ContactModel from '@/core/models/contact/ContactModel'

describe('ContactsTable', () => {
  it('shows one row per contact with its translated status', () => {
    const contacts = [
      new ContactModel(1, 'Ana López', 'NEW', '2026-10-12T15:30:00', 'ana@mail.com', '600123123', 'BDP One', 'Quiero una demo'),
      new ContactModel(2, 'Luis Pérez', 'CONTACTED', '2026-10-11T10:00:00', 'luis@mail.com'),
    ]

    const wrapper = mount(ContactsTable, { props: { contacts } })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('Ana López')
    expect(wrapper.text()).toContain('Nuevo')
    expect(wrapper.text()).toContain('Contactado')
    expect(wrapper.find('a[href="mailto:ana@mail.com"]').exists()).toBe(true)
  })

  it('shows an empty state when there are no contacts', () => {
    const wrapper = mount(ContactsTable, { props: { contacts: [] } })

    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('No hay contactos con este estado.')
  })
})
