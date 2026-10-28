import { ref } from 'vue'
import SummaryService from '@/core/apis/summary/SummaryService'
import SummaryModel from '@/core/models/summary/SummaryModel'

export function useAdminSummary(service = new SummaryService()) {
  const summary = ref(SummaryModel.empty())
  const isLoading = ref(false)
  const error = ref(null)

  async function load() {
    isLoading.value = true
    error.value = null
    try {
      summary.value = await service.get()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  return { summary, isLoading, error, load }
}
