import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LatestContacts from '@/components/admin/LatestContacts.vue'
import ContactModel from '@/core/models/contact/ContactModel'

describe('LatestContacts', () => {
  it('shows the latest contacts with their status', () => {
    const contacts = [new ContactModel(1, 'Ana López', 'NEW', '2026-10-12T15:30:00', 'ana@mail.com', '600123123', 'BDP One')]

    const wrapper = mount(LatestContacts, { props: { contacts } })

    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.text()).toContain('Ana López')
    expect(wrapper.text()).toContain('BDP One')
    expect(wrapper.text()).toContain('Nuevo')
  })

  it('shows an empty state', () => {
    const wrapper = mount(LatestContacts, { props: { contacts: [] } })

    expect(wrapper.text()).toContain('Todavía no hay mensajes')
  })
})
