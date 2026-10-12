import { describe, it, expect, vi } from 'vitest'
import { useAdminContacts } from '@/composables/admin/useAdminContacts'

function fakeService() {
  return {
    getPage: vi.fn().mockResolvedValue({ items: [{ id: 1 }], page: 0, totalPages: 3, totalElements: 25 }),
  }
}

describe('useAdminContacts', () => {
  it('loads the first page of all contacts', async () => {
    const service = fakeService()
    const { contacts, totalPages, totalElements, isLoading, loadPage } = useAdminContacts(service)

    await loadPage(0)

    expect(service.getPage).toHaveBeenCalledWith(null, 0, 10)
    expect(contacts.value).toHaveLength(1)
    expect(totalPages.value).toBe(3)
    expect(totalElements.value).toBe(25)
    expect(isLoading.value).toBe(false)
  })

  it('goes back to the first page when the filter changes', async () => {
    const service = fakeService()
    const { status, changeStatus } = useAdminContacts(service)

    await changeStatus('CONTACTED')

    expect(status.value).toBe('CONTACTED')
    expect(service.getPage).toHaveBeenCalledWith('CONTACTED', 0, 10)
  })

  it('stores the error when the API fails', async () => {
    const service = { getPage: vi.fn().mockRejectedValue(new Error('No tienes permiso para realizar esta acción.')) }
    const { error, loadPage } = useAdminContacts(service)

    await loadPage(0)

    expect(error.value).toBe('No tienes permiso para realizar esta acción.')
  })
})
