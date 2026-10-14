import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAdminAppearance } from '@/composables/admin/useAdminAppearance'
import { useHeroImage } from '@/composables/layout/useHeroImage'

const URL = 'http://localhost:8080/uploads/hero.jpg'

function fakeService(saved = null) {
  return {
    getHeroImageUrl: vi.fn().mockResolvedValue(saved),
    updateHeroImageUrl: vi.fn().mockImplementation(async (url) => url.trim()),
    resetHeroImage: vi.fn().mockResolvedValue(),
  }
}

describe('useAdminAppearance (BGSI-230)', () => {
  beforeEach(() => useHeroImage().setHeroImage(null))

  it('loads the current photo: original when there is none', async () => {
    const { isCustom, draftUrl, hasChanges, load } = useAdminAppearance(fakeService(null))

    await load()

    expect(isCustom.value).toBe(false)
    expect(draftUrl.value).toBe('')
    expect(hasChanges.value).toBe(false)
  })

  it('does not save an empty or non http URL', async () => {
    const service = fakeService()
    const { draftUrl, error, save } = useAdminAppearance(service)

    draftUrl.value = 'ftp://x.com/a.jpg'
    await save()

    expect(error.value).toBe('La URL debe empezar por http:// o https://')
    expect(service.updateHeroImageUrl).not.toHaveBeenCalled()
  })

  it('saves the photo and the public views get it at once', async () => {
    const { draftUrl, isCustom, feedback, save } = useAdminAppearance(fakeService())

    draftUrl.value = URL
    const saved = await save()

    expect(saved).toBe(true)
    expect(isCustom.value).toBe(true)
    expect(feedback.value).toContain('Foto guardada')
    expect(useHeroImage().heroImageUrl.value).toBe(URL)
  })

  it('goes back to the original photo', async () => {
    const service = fakeService(URL)
    const { isCustom, load, reset } = useAdminAppearance(service)
    await load()

    await reset()

    expect(service.resetHeroImage).toHaveBeenCalled()
    expect(isCustom.value).toBe(false)
    expect(useHeroImage().heroImageUrl.value).toBeNull()
  })
})
