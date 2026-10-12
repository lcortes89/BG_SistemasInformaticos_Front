import { ref } from 'vue'
import AdminContactService from '@/core/apis/contact/AdminContactService'

export function useAdminContacts(service = new AdminContactService(), pageSize = 10) {
  const contacts = ref([])
  const status = ref(null) // null = all
  const page = ref(0)
  const totalPages = ref(0)
  const totalElements = ref(0)
  const isLoading = ref(false)
  const error = ref(null)

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

  return { contacts, status, page, totalPages, totalElements, isLoading, error, loadPage, changeStatus }
}
