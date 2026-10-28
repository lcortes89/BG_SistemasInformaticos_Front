import { describe, it, expect, vi } from 'vitest'
import ContactService from '@/core/apis/contact/ContactService'
import ContactModel from '@/core/models/contact/ContactModel'

describe('ContactService', () => {
  it('sends the cleaned form to the backend and returns a ContactModel', async () => {
    const fakeRepository = {
      send: vi.fn().mockResolvedValue({ id: 1, name: 'Ana', status: 'NEW', createdAt: '2026-10-12T10:00:00' }),
    }
    const form = {
      name: '  Ana  ', email: 'ana@mail.com', phone: '', interestedService: '',
      message: 'Hola', gdprConsent: true,
    }

    const result = await new ContactService(fakeRepository).send(form)

    expect(fakeRepository.send).toHaveBeenCalledWith({
      name: 'Ana', email: 'ana@mail.com', phone: null, interestedService: null,
      message: 'Hola', gdprConsent: true,
    })
    expect(result).toBeInstanceOf(ContactModel)
    expect(result.status).toBe('NEW')
  })
})
