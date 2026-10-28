import { describe, it, expect } from 'vitest'
import ContactModel from '@/core/models/contact/ContactModel'

describe('ContactModel', () => {
  it('translates the status into Spanish', () => {
    expect(new ContactModel(1, 'Ana', 'CONTACTED', null).getStatusLabel()).toBe('Contactado')
    expect(new ContactModel(2, 'Luis', 'ARCHIVED', null).getStatusLabel()).toBe('Archivado')
  })

  it('formats the creation date for Spain', () => {
    const contact = new ContactModel(1, 'Ana', 'NEW', '2026-10-12T15:30:00')

    expect(contact.getFormattedDate()).toContain('12/10/2026')
  })
})
