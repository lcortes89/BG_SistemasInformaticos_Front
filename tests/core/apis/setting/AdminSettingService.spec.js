import { describe, it, expect, vi } from 'vitest'
import AdminSettingService from '@/core/apis/setting/AdminSettingService'

const settings = { notifyEmail: 'duenio@bg.es', senderName: 'BG Sistemas Web', senderAccount: 'web@gmail.com' }

function fakeRepo() {
  return {
    findMail: vi.fn().mockResolvedValue(settings),
    updateMail: vi.fn().mockImplementation(async (body) => ({ ...body, senderAccount: 'web@gmail.com' })),
    sendTestMail: vi.fn().mockResolvedValue(),
  }
}

describe('AdminSettingService · email settings (BGSI-261)', () => {
  it('returns the email settings of the backend', async () => {
    const repo = fakeRepo()

    expect(await new AdminSettingService({}, repo).getMailSettings()).toEqual(settings)
  })

  it('sends the values without spaces and without the confirmation field', async () => {
    const repo = fakeRepo()

    await new AdminSettingService({}, repo).updateMailSettings({
      notifyEmail: ' nuevo@bg.es ', confirmEmail: 'nuevo@bg.es', senderName: ' Web de BG ',
    })

    expect(repo.updateMail).toHaveBeenCalledWith({ notifyEmail: 'nuevo@bg.es', senderName: 'Web de BG' })
  })

  it('asks the backend to send the test email', async () => {
    const repo = fakeRepo()

    await new AdminSettingService({}, repo).sendTestMail()

    expect(repo.sendTestMail).toHaveBeenCalled()
  })
})
