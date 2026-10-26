import { computed, reactive, ref } from 'vue'

// service must have: getPage(page, size, filters), create(form), update(id, form), remove(id)
// and, for the tables with "Activar / Inactivar", setActive(id, active) (BGSI-310)
// conflictMessage: text shown when the backend answers 409 (e.g. deleting a brand with services)
export function useAdminCrud(service, { pageSize = 10, conflictMessage = null } = {}) {
  const items = ref([])
  const filters = reactive({})
  const page = ref(0)
  const totalPages = ref(0)
  const totalElements = ref(0)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref(null)
  const feedback = ref(null)
  const actionError = ref(null)

  function clearMessages() {
    feedback.value = null
    actionError.value = null
  }

  async function loadPage(pageNumber = 0) {
    isLoading.value = true
    error.value = null
    try {
      const result = await service.getPage(pageNumber, pageSize, { ...filters })
      items.value = result.items
      page.value = result.page
      totalPages.value = result.totalPages
      totalElements.value = result.totalElements
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  // Changing a filter always starts again from the first page
  async function setFilter(name, value) {
    filters[name] = value
    await loadPage(0)
  }

  // BGSI-302: "Limpiar filtros"
  const hasFilters = computed(() => Object.values(filters).some((value) => value !== null && value !== undefined && value !== ''))

  async function clearFilters() {
    for (const name of Object.keys(filters)) filters[name] = null
    await loadPage(0)
  }

  // id = null -> create, otherwise update. Throws so the form can show field errors.
  async function save(id, form, successMessage) {
    clearMessages()
    isSaving.value = true
    try {
      if (id) await service.update(id, form)
      else await service.create(form)
      feedback.value = successMessage
      await loadPage(id ? page.value : 0)
    } finally {
      isSaving.value = false
    }
  }

  async function remove(id, successMessage) {
    clearMessages()
    try {
      await service.remove(id)
      feedback.value = successMessage
      // If the last item of a page was deleted, go back one page
      const targetPage = items.value.length === 1 && page.value > 0 ? page.value - 1 : page.value
      await loadPage(targetPage)
      return true
    } catch (e) {
      // BGSI-275: closing "Confirma tu contraseña" is not an error, nothing is deleted
      if (!e.cancelled) actionError.value = e.status === 409 && conflictMessage ? conflictMessage : e.message
      return false
    }
  }

  // BGSI-310: show or hide on the website without deleting. The page is reloaded to show the new state
  async function setActive(id, active, successMessage) {
    clearMessages()
    try {
      await service.setActive(id, active)
      feedback.value = successMessage
      await loadPage(page.value)
      return true
    } catch (e) {
      actionError.value = e.message
      return false
    }
  }

  return {
    items, filters, hasFilters, page, totalPages, totalElements, isLoading, isSaving, error, feedback, actionError,
    loadPage, setFilter, clearFilters, save, remove, setActive, clearMessages,
  }
}
