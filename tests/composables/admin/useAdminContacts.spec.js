import { describe, it, expect, vi } from 'vitest'
import { useAdminContacts } from '@/composables/admin/useAdminContacts'

function fakeService() {
  return {
    getPage: vi.fn().mockResolvedValue({ items: [{ id: 1 }], page: 0, totalPages: 3, totalElements: 25 }),
    update: vi.fn().mockResolvedValue({ id: 1 }),
    remove: vi.fn().mockResolvedValue(undefined),
  }
}

describe('useAdminContacts', () => {
  // BGSI-316: 5 contacts per page
  it('loads the first page of all contacts', async () => {
    const service = fakeService()
    const { contacts, totalPages, totalElements, isLoading, loadPage } = useAdminContacts(service)

    await loadPage(0)

    expect(service.getPage).toHaveBeenCalledWith(null, 0, 5)
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
    expect(service.getPage).toHaveBeenCalledWith('CONTACTED', 0, 5)
  })

  it('stores the error when the API fails', async () => {
    const service = { getPage: vi.fn().mockRejectedValue(new Error('No tienes permiso para realizar esta acción.')) }
    const { error, loadPage } = useAdminContacts(service)

    await loadPage(0)

    expect(error.value).toBe('No tienes permiso para realizar esta acción.')
  })

  it('updates a contact, shows a success message and reloads the page', async () => {
    const service = fakeService()
    const { feedback, updateContact } = useAdminContacts(service)

    const ok = await updateContact(1, { status: 'ARCHIVED' }, 'Contacto archivado')

    expect(ok).toBe(true)
    expect(service.update).toHaveBeenCalledWith(1, { status: 'ARCHIVED' })
    expect(service.getPage).toHaveBeenCalled()
    expect(feedback.value).toBe('Contacto archivado')
  })

  it('shows the error when the update fails', async () => {
    const service = { ...fakeService(), update: vi.fn().mockRejectedValue(new Error('Contact with id 9 not found')) }
    const { feedback, actionError, updateContact } = useAdminContacts(service)

    const ok = await updateContact(9, { status: 'ARCHIVED' })

    expect(ok).toBe(false)
    expect(feedback.value).toBeNull()
    expect(actionError.value).toBe('Contact with id 9 not found')
  })

  // ---------- BGSI-308: delete ----------

  it('deletes a contact, says so and reloads the same page', async () => {
    const service = fakeService()
    const { feedback, actionError, loadPage, removeContact } = useAdminContacts(service)
    await loadPage(0)

    const ok = await removeContact({ id: 1, name: 'Ana López' })

    expect(ok).toBe(true)
    expect(service.remove).toHaveBeenCalledWith(1)
    expect(service.getPage).toHaveBeenLastCalledWith(null, 0, 5)
    expect(feedback.value).toBe('Contacto de Ana López borrado')
    expect(actionError.value).toBeNull()
  })

  it('goes back one page after deleting the last contact of a page', async () => {
    const service = fakeService()
    service.getPage.mockResolvedValueOnce({ items: [{ id: 7 }], page: 2, totalPages: 3, totalElements: 21 })
    const { loadPage, removeContact } = useAdminContacts(service)
    await loadPage(2)

    await removeContact({ id: 7, name: 'Luis' })

    expect(service.getPage).toHaveBeenLastCalledWith(null, 1, 5)
  })

  it('says nothing when the password dialog is closed', async () => {
    const service = { ...fakeService(), remove: vi.fn().mockRejectedValue(Object.assign(new Error('cancelled'), { cancelled: true })) }
    const { feedback, actionError, removeContact } = useAdminContacts(service)

    const ok = await removeContact({ id: 1, name: 'Ana López' })

    expect(ok).toBe(false)
    expect(feedback.value).toBeNull()
    expect(actionError.value).toBeNull()
  })

  it('shows the error when deleting fails', async () => {
    const service = { ...fakeService(), remove: vi.fn().mockRejectedValue(new Error('Contact with id 9 not found')) }
    const { actionError, removeContact } = useAdminContacts(service)

    const ok = await removeContact({ id: 9, name: 'X' })

    expect(ok).toBe(false)
    expect(actionError.value).toBe('Contact with id 9 not found')
  })
})
