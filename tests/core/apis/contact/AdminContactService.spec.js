import { describe, it, expect, vi } from 'vitest'
import AdminContactService from '@/core/apis/contact/AdminContactService'
import ContactModel from '@/core/models/contact/ContactModel'

const contactDto = {
  id: 1, name: 'Ana López', email: 'ana@mail.com', phone: '600123123', interestedService: 'BDP One',
  message: 'Quiero una demo', status: 'NEW', createdAt: '2026-10-12T15:30:00', note: null,
}

describe('AdminContactService', () => {
  it('returns the contacts of the page as ContactModel objects plus the pagination info', async () => {
    const fakeRepository = {
      findPage: vi.fn().mockResolvedValue({ content: [contactDto], page: 0, size: 10, totalElements: 1, totalPages: 1, last: true }),
    }

    const result = await new AdminContactService(fakeRepository).getPage('NEW', 0, 10)

    expect(fakeRepository.findPage).toHaveBeenCalledWith('NEW', 0, 10)
    expect(result.items[0]).toBeInstanceOf(ContactModel)
    expect(result.items[0].email).toBe('ana@mail.com')
    expect(result.items[0].getStatusLabel()).toBe('Nuevo')
    expect(result.totalElements).toBe(1)
  })

  it('sends the changes and returns the updated contact', async () => {
    const fakeRepository = { update: vi.fn().mockResolvedValue({ ...contactDto, status: 'CONTACTED', note: 'Llamada' }) }

    const result = await new AdminContactService(fakeRepository).update(1, { status: 'CONTACTED', note: 'Llamada' })

    expect(fakeRepository.update).toHaveBeenCalledWith(1, { status: 'CONTACTED', note: 'Llamada' })
    expect(result).toBeInstanceOf(ContactModel)
    expect(result.note).toBe('Llamada')
  })
})
