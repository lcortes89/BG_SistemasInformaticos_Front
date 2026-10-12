import { describe, it, expect, vi } from 'vitest'
import SummaryService from '@/core/apis/summary/SummaryService'
import ContactModel from '@/core/models/contact/ContactModel'

describe('SummaryService', () => {
  it('returns the counters and the latest contacts as ContactModel objects', async () => {
    const repo = {
      find: vi.fn().mockResolvedValue({
        newContacts: 3, totalContacts: 12, activeBrands: 4, totalBrands: 5,
        featuredServices: 3, totalServices: 10, publishedClients: 2, totalClients: 3,
        latestContacts: [{ id: 1, name: 'Ana', status: 'NEW', createdAt: '2026-10-12T10:00:00' }],
      }),
    }

    const summary = await new SummaryService(repo).get()

    expect(summary.newContacts).toBe(3)
    expect(summary.totalServices).toBe(10)
    expect(summary.latestContacts[0]).toBeInstanceOf(ContactModel)
    expect(summary.latestContacts[0].getStatusLabel()).toBe('Nuevo')
  })

  // BGSI-141: missing data never breaks the dashboard
  it('turns missing values into zeros and an empty list', async () => {
    const summary = await new SummaryService({ find: vi.fn().mockResolvedValue({}) }).get()

    expect(summary.newContacts).toBe(0)
    expect(summary.totalClients).toBe(0)
    expect(summary.latestContacts).toEqual([])
  })
})
