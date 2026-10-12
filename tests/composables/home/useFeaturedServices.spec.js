import { describe, it, expect, vi } from 'vitest'
import { useFeaturedServices } from '@/composables/home/useFeaturedServices'

describe('useFeaturedServices', () => {
  it('loads the featured services and stops loading', async () => {
    const fakeService = { getFeatured: vi.fn().mockResolvedValue([{ id: 1, name: 'BDP One' }]) }
    const { services, isLoading, error, load } = useFeaturedServices(fakeService)

    await load()

    expect(services.value).toHaveLength(1)
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('stores the error message when the API fails', async () => {
    const fakeService = { getFeatured: vi.fn().mockRejectedValue(new Error('Server down')) }
    const { services, isLoading, error, load } = useFeaturedServices(fakeService)

    await load()

    expect(services.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(error.value).toBe('Server down')
  })
})
