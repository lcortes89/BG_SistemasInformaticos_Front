import { ref } from 'vue'
import ServiceService from '@/core/apis/service/ServiceService'

// Services for the "Servicio de interés" select. If it fails, the select just stays optional.
export function useServiceOptions(service = new ServiceService()) {
  const options = ref([])

  async function loadOptions() {
    try {
      options.value = await service.getAll()
    } catch {
      options.value = []
    }
  }

  return { options, loadOptions }
}
