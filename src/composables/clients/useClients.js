import { ref } from 'vue'
import ClientService from '@/core/apis/client/ClientService'

export function useClients(service = new ClientService(), pageSize = 6) {
  const clients = ref([])
  const page = ref(0)
  const totalPages = ref(0)
  const isLoading = ref(false)
  const error = ref(null)

  async function loadPage(pageNumber = 0) {
    isLoading.value = true
    error.value = null
    try {
      const result = await service.getPublished(pageNumber, pageSize)
      clients.value = result.items
      page.value = result.page
      totalPages.value = result.totalPages
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  return { clients, page, totalPages, isLoading, error, loadPage }
}
