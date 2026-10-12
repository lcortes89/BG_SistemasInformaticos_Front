import { describe, it, expect, vi } from 'vitest'
import { useSolutions } from '@/composables/solutions/useSolutions'

const bdp = { id: 1, name: 'BDP' }

describe('useSolutions', () => {
  it('loads the brands', async () => {
    const fakeService = { getAll: vi.fn().mockResolvedValue([bdp]), getServices: vi.fn() }
    const { brands, isLoadingBrands, loadBrands } = useSolutions(fakeService)

    await loadBrands()

    expect(brands.value).toEqual([bdp])
    expect(isLoadingBrands.value).toBe(false)
  })

  it('selects a brand and loads its services', async () => {
    const fakeService = { getAll: vi.fn(), getServices: vi.fn().mockResolvedValue([{ id: 2, name: 'BDP One' }]) }
    const { selectedBrand, services, selectBrand } = useSolutions(fakeService)

    await selectBrand(bdp)

    expect(fakeService.getServices).toHaveBeenCalledWith(1)
    expect(selectedBrand.value).toEqual(bdp)
    expect(services.value).toHaveLength(1)
  })

  it('stores the error when the brands cannot be loaded', async () => {
    const fakeService = { getAll: vi.fn().mockRejectedValue(new Error('Server down')), getServices: vi.fn() }
    const { brandsError, loadBrands } = useSolutions(fakeService)

    await loadBrands()

    expect(brandsError.value).toBe('Server down')
  })
})
