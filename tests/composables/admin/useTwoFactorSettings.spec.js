import { describe, it, expect, vi } from 'vitest'
import { useTwoFactorSettings } from '@/composables/admin/useTwoFactorSettings'

const codes = ['k7mp-3xqa', 'h4tz-9wrc']

function fakeService(enabled = false) {
  return {
    getTwoFactor: vi.fn().mockResolvedValue({ enabled, recoveryCodesLeft: enabled ? 7 : 0 }),
    setupTwoFactor: vi.fn().mockResolvedValue({ secret: 'ABCDEFGH', otpauthUri: 'otpauth://totp/x' }),
    enableTwoFactor: vi.fn().mockResolvedValue(codes),
    disableTwoFactor: vi.fn().mockResolvedValue(),
  }
}

const fakeQr = vi.fn().mockResolvedValue('data:image/png;base64,QR')

// BGSI-276: "Mi cuenta > Verificación en dos pasos"
describe('useTwoFactorSettings', () => {
  it('loads the status', async () => {
    const off = useTwoFactorSettings(fakeService(false), fakeQr)
    await off.load()
    expect(off.view.value).toBe('off')

    const on = useTwoFactorSettings(fakeService(true), fakeQr)
    await on.load()
    expect(on.view.value).toBe('on')
    expect(on.recoveryCodesLeft.value).toBe(7)
  })

  it('shows the QR, asks for 6 digits and then the recovery codes', async () => {
    const service = fakeService()
    const twoFactor = useTwoFactorSettings(service, fakeQr)
    await twoFactor.load()

    await twoFactor.start()
    expect(twoFactor.view.value).toBe('setup')
    expect(twoFactor.setup.value).toEqual({ secret: 'ABCDEFGH', otpauthUri: 'otpauth://totp/x', qr: 'data:image/png;base64,QR' })
    expect(fakeQr).toHaveBeenCalledWith('otpauth://totp/x')

    twoFactor.code.value = '12'
    await twoFactor.confirm()
    expect(twoFactor.error.value).toBe('Escribe las 6 cifras que muestra la app')
    expect(service.enableTwoFactor).not.toHaveBeenCalled()

    twoFactor.code.value = '123456'
    await twoFactor.confirm()
    expect(service.enableTwoFactor).toHaveBeenCalledWith('123456')
    expect(twoFactor.view.value).toBe('codes')
    expect(twoFactor.recoveryCodes.value).toEqual(codes)
    expect(twoFactor.codesAsText()).toContain('k7mp-3xqa\nh4tz-9wrc')
  })

  it('forgets the codes when they were saved', async () => {
    const twoFactor = useTwoFactorSettings(fakeService(), fakeQr)
    await twoFactor.start()
    twoFactor.code.value = '123456'
    await twoFactor.confirm()

    twoFactor.finish()

    expect(twoFactor.view.value).toBe('on')
    expect(twoFactor.recoveryCodes.value).toEqual([])
    expect(twoFactor.recoveryCodesLeft.value).toBe(2)
    expect(twoFactor.feedback.value).toContain('activada')
  })

  it('shows a clear message for a wrong first code', async () => {
    const service = fakeService()
    service.enableTwoFactor.mockRejectedValue(Object.assign(new Error('x'), { status: 400, details: { code: 'Code is not correct' } }))
    const twoFactor = useTwoFactorSettings(service, fakeQr)
    await twoFactor.start()
    twoFactor.code.value = '000000'

    await twoFactor.confirm()

    expect(twoFactor.view.value).toBe('setup')
    expect(twoFactor.error.value).toBe('Código incorrecto. Escribe el que muestra ahora la app.')
  })

  it('cancel goes back without turning it on', async () => {
    const twoFactor = useTwoFactorSettings(fakeService(), fakeQr)
    await twoFactor.start()

    twoFactor.cancelSetup()

    expect(twoFactor.view.value).toBe('off')
    expect(twoFactor.setup.value).toBeNull()
  })

  it('disables it, and closing "Confirma tu contraseña" changes nothing', async () => {
    const service = fakeService(true)
    service.disableTwoFactor
      .mockRejectedValueOnce(Object.assign(new Error('Acción cancelada'), { cancelled: true }))
      .mockResolvedValueOnce()
    const twoFactor = useTwoFactorSettings(service, fakeQr)
    await twoFactor.load()

    await twoFactor.disable()
    expect(twoFactor.view.value).toBe('on')
    expect(twoFactor.error.value).toBeNull()

    await twoFactor.disable()
    expect(twoFactor.view.value).toBe('off')
    expect(twoFactor.feedback.value).toBe('Verificación en dos pasos desactivada.')
  })
})
