import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useHeroImage } from '@/composables/layout/useHeroImage'

describe('useHeroImage (BGSI-231)', () => {
  beforeEach(() => useHeroImage().setHeroImage(null))

  it('loads the photo chosen in "Apariencia"', async () => {
    const { heroImageUrl, loadHeroImage } = useHeroImage({ getHeroImageUrl: vi.fn().mockResolvedValue('http://x.com/a.jpg') })

    await loadHeroImage()

    expect(heroImageUrl.value).toBe('http://x.com/a.jpg')
  })

  it('keeps the default photo (null) when the backend fails', async () => {
    const { heroImageUrl, loadHeroImage } = useHeroImage({ getHeroImageUrl: vi.fn().mockRejectedValue(new Error('down')) })

    await loadHeroImage()

    expect(heroImageUrl.value).toBeNull()
  })

  it('shares the same value between every component that uses it', () => {
    useHeroImage().setHeroImage('http://x.com/b.jpg')

    expect(useHeroImage().heroImageUrl.value).toBe('http://x.com/b.jpg')
  })
})
