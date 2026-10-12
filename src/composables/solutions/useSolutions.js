import { ref } from 'vue'
import BrandService from '@/core/apis/brand/BrandService'

export function useSolutions(service = new BrandService()) {
  const brands = ref([])
  const isLoadingBrands = ref(false)
  const brandsError = ref(null)

  const selectedBrand = ref(null)
  const services = ref([])
  const isLoadingServices = ref(false)
  const servicesError = ref(null)

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

  async function selectBrand(brand) {
    selectedBrand.value = brand
    services.value = []
    isLoadingServices.value = true
    servicesError.value = null
    try {
      services.value = await service.getServices(brand.id)
    } catch (e) {
      servicesError.value = e.message
    } finally {
      isLoadingServices.value = false
    }
  }

  return {
    brands, isLoadingBrands, brandsError, loadBrands,
    selectedBrand, services, isLoadingServices, servicesError, selectBrand,
  }
}
