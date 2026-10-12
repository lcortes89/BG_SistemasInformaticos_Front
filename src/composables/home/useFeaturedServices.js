import { ref } from 'vue'
import ServiceService from '@/core/apis/service/ServiceService'

// Reusable state + logic to load the featured services
export function useFeaturedServices(service = new ServiceService()) {
  const services = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function load() {
    isLoading.value = true
    error.value = null
    try {
      services.value = await service.getFeatured()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  return { services, isLoading, error, load }
}
