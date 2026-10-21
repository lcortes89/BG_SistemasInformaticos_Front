import { ref } from 'vue'
import QRCode from 'qrcode'
import AccountService from '@/core/apis/account/AccountService'

// BGSI-276: "Mi cuenta > Verificación en dos pasos".
// view: 'loading' | 'off' | 'setup' (QR + first code) | 'codes' (10 recovery codes, only once) | 'on'
export function useTwoFactorSettings(service = new AccountService(), toQr = (text) => QRCode.toDataURL(text, { margin: 1, width: 220 })) {
  const view = ref('loading')
  const recoveryCodesLeft = ref(0)
  const setup = ref(null) // { secret, otpauthUri, qr }
  const code = ref('')
  const recoveryCodes = ref([])
  const error = ref(null)
  const feedback = ref(null)
  const isBusy = ref(false)

  async function load() {
    error.value = null
    try {
      const status = await service.getTwoFactor()
      recoveryCodesLeft.value = status.recoveryCodesLeft
      view.value = status.enabled ? 'on' : 'off'
    } catch (e) {
      error.value = e.message
      view.value = 'off'
    }
  }

  async function run(action) {
    error.value = null
    feedback.value = null
    isBusy.value = true
    try {
      return await action()
    } catch (e) {
      if (e.cancelled) return null // "Confirma tu contraseña" closed (BGSI-275)
      error.value = e.status === 400 && e.details?.code
        ? 'Código incorrecto. Escribe el que muestra ahora la app.'
        : e.message
      return null
    } finally {
      isBusy.value = false
    }
  }

  // Step 1: secret + QR to scan
  async function start() {
    await run(async () => {
      const data = await service.setupTwoFactor()
      setup.value = { ...data, qr: await toQr(data.otpauthUri) }
      code.value = ''
      view.value = 'setup'
    })
  }

  // Step 2: the first code proves the app works
  async function confirm() {
    if (!/^\d{6}$/.test(code.value.trim())) {
      error.value = 'Escribe las 6 cifras que muestra la app'
      return
    }
    await run(async () => {
      recoveryCodes.value = await service.enableTwoFactor(code.value)
      setup.value = null
      code.value = ''
      view.value = 'codes'
    })
  }

  function cancelSetup() {
    setup.value = null
    code.value = ''
    error.value = null
    view.value = 'off'
  }

  // The codes are not kept in memory once they were saved
  function finish() {
    recoveryCodesLeft.value = recoveryCodes.value.length
    recoveryCodes.value = []
    view.value = 'on'
    feedback.value = 'Verificación en dos pasos activada. A partir de ahora te pediremos el código al entrar.'
  }

  // Needs the password and the code: the interceptor opens "Confirma tu contraseña"
  async function disable() {
    await run(async () => {
      await service.disableTwoFactor()
      view.value = 'off'
      feedback.value = 'Verificación en dos pasos desactivada.'
    })
  }

  function codesAsText() {
    return [
      'BG Sistemas - Códigos de recuperación',
      'Cada código sirve una sola vez. Guárdalos en un lugar seguro.',
      '',
      ...recoveryCodes.value,
    ].join('\n')
  }

  return {
    view, recoveryCodesLeft, setup, code, recoveryCodes, error, feedback, isBusy,
    load, start, confirm, cancelSetup, finish, disable, codesAsText,
  }
}
