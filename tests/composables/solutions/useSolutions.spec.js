import { describe, it, expect, vi } from 'vitest'
import { useSolutions } from '@/composables/solutions/useSolutions'

const bdp = { id: 1, name: 'BDP' }
const firstPage = { items: [{ id: 2, name: 'BDP One' }], page: 0, totalPages: 2, totalElements: 6 }

describe('useSolutions', () => {
  it('loads the brands', async () => {
    const fakeService = { getAll: vi.fn().mockResolvedValue([bdp]), getServices: vi.fn() }
    const { brands, isLoadingBrands, loadBrands } = useSolutions(fakeService)

    await loadBrands()

    expect(brands.value).toEqual([bdp])
    expect(isLoadingBrands.value).toBe(false)
  })

  it('selects a brand and loads the first page of its services (BGSI-248)', async () => {
    const fakeService = { getAll: vi.fn(), getServices: vi.fn().mockResolvedValue(firstPage) }
    const { selectedBrand, services, servicesTotalPages, servicesTotal, selectBrand } = useSolutions(fakeService)

    await selectBrand(bdp)

    expect(fakeService.getServices).toHaveBeenCalledWith(1, 0, 4)
    expect(selectedBrand.value).toEqual(bdp)
    expect(services.value).toHaveLength(1)
    expect(servicesTotalPages.value).toBe(2)
    expect(servicesTotal.value).toBe(6)
  })

  it('loads another page of the same brand (BGSI-248)', async () => {
    const fakeService = {
      getAll: vi.fn(),
      getServices: vi.fn()
        .mockResolvedValueOnce(firstPage)
        .mockResolvedValueOnce({ items: [{ id: 6, name: 'BDP Kiosk' }], page: 1, totalPages: 2, totalElements: 6 }),
    }
    const { servicesPage, services, selectBrand, loadServicesPage } = useSolutions(fakeService)

    await selectBrand(bdp)
    await loadServicesPage(1)

    expect(fakeService.getServices).toHaveBeenLastCalledWith(1, 1, 4)
    expect(servicesPage.value).toBe(1)
    expect(services.value[0].name).toBe('BDP Kiosk')
  })

  it('stores the error when the brands cannot be loaded', async () => {
    const fakeService = { getAll: vi.fn().mockRejectedValue(new Error('Server down')), getServices: vi.fn() }
    const { brandsError, loadBrands } = useSolutions(fakeService)

    await loadBrands()

    expect(brandsError.value).toBe('Server down')
  })
})
