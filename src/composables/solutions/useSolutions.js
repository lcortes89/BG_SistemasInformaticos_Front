import { ref } from 'vue'
import BrandService from '@/core/apis/brand/BrandService'

export function useSolutions(service = new BrandService(), pageSize = 4) {
  const brands = ref([])
  const isLoadingBrands = ref(false)
  const brandsError = ref(null)

  const selectedBrand = ref(null)
  const services = ref([])
  const isLoadingServices = ref(false)
  const servicesError = ref(null)

  // BGSI-248: the products of the chosen brand come one page at a time
  const servicesPage = ref(0)
  const servicesTotalPages = ref(0)
  const servicesTotal = ref(0)

  async function loadBrands() {
    isLoadingBrands.value = true
    brandsError.value = null
    try {
      brands.value = await service.getAll()
    } catch (e) {
      brandsError.value = e.message
    } finally {
      isLoadingBrands.value = false
    }
  }

  async function loadServicesPage(pageNumber = 0) {
    if (!selectedBrand.value) return
    isLoadingServices.value = true
    servicesError.value = null
    try {
      const result = await service.getServices(selectedBrand.value.id, pageNumber, pageSize)
      services.value = result.items
      servicesPage.value = result.page
      servicesTotalPages.value = result.totalPages
      servicesTotal.value = result.totalElements
    } catch (e) {
      servicesError.value = e.message
    } finally {
      isLoadingServices.value = false
    }
  }

  // A new brand always starts on its first page
  async function selectBrand(brand) {
    selectedBrand.value = brand
    services.value = []
    servicesTotalPages.value = 0
    servicesTotal.value = 0
    await loadServicesPage(0)
  }

  return {
    brands, isLoadingBrands, brandsError, loadBrands,
    selectedBrand, services, isLoadingServices, servicesError, selectBrand,
    servicesPage, servicesTotalPages, servicesTotal, pageSize, loadServicesPage,
  }
}
