import { describe, it, expect, vi } from 'vitest'
import AdminContactService from '@/core/apis/contact/AdminContactService'
import ContactModel from '@/core/models/contact/ContactModel'

const pageResponse = {
  content: [{
    id: 1, name: 'Ana López', email: 'ana@mail.com', phone: '600123123', interestedService: 'BDP One',
    message: 'Quiero una demo', status: 'NEW', createdAt: '2026-10-12T15:30:00', note: null,
  }],
  page: 0, size: 10, totalElements: 1, totalPages: 1, last: true,
}

describe('AdminContactService', () => {
  it('returns the contacts of the page as ContactModel objects plus the pagination info', async () => {
    const fakeRepository = { findPage: vi.fn().mockResolvedValue(pageResponse) }

    const result = await new AdminContactService(fakeRepository).getPage('NEW', 0, 10)

    expect(fakeRepository.findPage).toHaveBeenCalledWith('NEW', 0, 10)
    expect(result.items[0]).toBeInstanceOf(ContactModel)
    expect(result.items[0].email).toBe('ana@mail.com')
    expect(result.items[0].getStatusLabel()).toBe('Nuevo')
    expect(result.totalElements).toBe(1)
  })
})
