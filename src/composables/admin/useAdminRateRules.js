import { reactive, ref } from 'vue'
import AdminRateRuleService from '@/core/apis/rate/AdminRateRuleService'

export function useAdminRateRules(service = new AdminRateRuleService()) {
  const groups = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const savingId = ref(null)
  const feedback = ref(null)
  const rowErrors = reactive({}) // { [ruleId]: message }

  async function load() {
    isLoading.value = true
    error.value = null
    try {
      groups.value = await service.getGroups()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  // Validates in the browser first, then sends the new amount
  async function save(rule, value) {
    feedback.value = null
    delete rowErrors[rule.id]

    const validationError = rule.validate(value)
    if (validationError) {
      rowErrors[rule.id] = validationError
      return false
    }

    savingId.value = rule.id
    try {
      const updated = await service.updateAmount(rule.id, value)
      rule.amount = updated.amount
      feedback.value = `${rule.label}: precio guardado`
      return true
    } catch (e) {
      rowErrors[rule.id] = e.message
      return false
    } finally {
      savingId.value = null
    }
  }

  return { groups, isLoading, error, savingId, feedback, rowErrors, load, save }
}
