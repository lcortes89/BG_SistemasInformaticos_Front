import { ref } from 'vue'
import AdminContactService from '@/core/apis/contact/AdminContactService'

// BGSI-316: 5 contacts per page
export function useAdminContacts(service = new AdminContactService(), pageSize = 5) {
  const contacts = ref([])
  const status = ref(null) // null = all
  const page = ref(0)
  const totalPages = ref(0)
  const totalElements = ref(0)
  const isLoading = ref(false)
  const error = ref(null)
  const feedback = ref(null) // success message after an action
  const actionError = ref(null) // error message after an action

  async function loadPage(pageNumber = 0) {
    isLoading.value = true
    error.value = null
    try {
      const result = await service.getPage(status.value, pageNumber, pageSize)
      contacts.value = result.items
      page.value = result.page
      totalPages.value = result.totalPages
      totalElements.value = result.totalElements
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  // Changing the filter always starts again from the first page
  async function changeStatus(newStatus) {
    status.value = newStatus
    await loadPage(0)
  }

  // Saves the change and reloads the page (the contact may leave the current filter)
  async function updateContact(id, changes, successMessage = 'Contacto actualizado') {
    feedback.value = null
    actionError.value = null
    try {
      await service.update(id, changes)
      feedback.value = successMessage
      await loadPage(page.value)
      return true
    } catch (e) {
      actionError.value = e.message
      return false
    }
  }

  // BGSI-308: deletes for good. The interceptor asks for the password first (BGSI-275)
  async function removeContact(contact) {
    feedback.value = null
    actionError.value = null
    try {
      await service.remove(contact.id)
      feedback.value = `Contacto de ${contact.name} borrado`
      // The last contact of the last page: go back one page
      const lastOfPage = contacts.value.length === 1 && page.value > 0
      await loadPage(lastOfPage ? page.value - 1 : page.value)
      return true
    } catch (e) {
      if (!e.cancelled) actionError.value = e.message // dialog closed: nothing to say
      return false
    }
  }

  return {
    contacts, status, page, totalPages, totalElements, isLoading, error, feedback, actionError,
    loadPage, changeStatus, updateContact, removeContact,
  }
}
