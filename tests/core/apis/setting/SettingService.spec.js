import { describe, it, expect, vi } from 'vitest'
import SettingService from '@/core/apis/setting/SettingService'
import AdminSettingService from '@/core/apis/setting/AdminSettingService'

describe('SettingService (BGSI-231)', () => {
  it('returns the chosen photo, or null when there is none', async () => {
    const withPhoto = { getHero: vi.fn().mockResolvedValue({ imageUrl: 'http://x.com/a.jpg' }) }
    const withoutPhoto = { getHero: vi.fn().mockResolvedValue({ imageUrl: null }) }

    expect(await new SettingService(withPhoto).getHeroImageUrl()).toBe('http://x.com/a.jpg')
    expect(await new SettingService(withoutPhoto).getHeroImageUrl()).toBeNull()
  })
})

describe('AdminSettingService (BGSI-230)', () => {
  it('saves the trimmed URL and returns the saved one', async () => {
    const adminRepo = { updateHero: vi.fn().mockResolvedValue({ imageUrl: 'http://x.com/a.jpg' }) }
    const service = new AdminSettingService({ getHeroImageUrl: vi.fn() }, adminRepo)

    const saved = await service.updateHeroImageUrl('  http://x.com/a.jpg ')

    expect(adminRepo.updateHero).toHaveBeenCalledWith('http://x.com/a.jpg')
    expect(saved).toBe('http://x.com/a.jpg')
  })

  it('resets the photo through the admin endpoint', async () => {
    const adminRepo = { resetHero: vi.fn().mockResolvedValue() }

    await new AdminSettingService({ getHeroImageUrl: vi.fn() }, adminRepo).resetHeroImage()

    expect(adminRepo.resetHero).toHaveBeenCalled()
  })
})
