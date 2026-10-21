import { describe, it, expect, vi } from 'vitest'
import { lockedMessage, useLoginForm } from '@/composables/admin/useLoginForm'

describe('useLoginForm', () => {
  it('does not log in and shows errors when the fields are empty', async () => {
    const fakeStore = { login: vi.fn() }
    const { errors, submit } = useLoginForm(fakeStore)

    const loggedIn = await submit()

    expect(loggedIn).toBe(false)
    expect(fakeStore.login).not.toHaveBeenCalled()
    expect(Object.keys(errors)).toEqual(['email', 'password'])
  })

  it('logs in with valid credentials', async () => {
    const fakeStore = { login: vi.fn().mockResolvedValue() }
    const { form, submit } = useLoginForm(fakeStore)
    form.email = 'admin@bg.es'
    form.password = 'secret123'

    const loggedIn = await submit()

    expect(loggedIn).toBe(true)
    expect(fakeStore.login).toHaveBeenCalledWith('admin@bg.es', 'secret123')
  })

  it('shows a generic message when the credentials are wrong (401)', async () => {
    const error = Object.assign(new Error('You must log in to access this resource'), { status: 401 })
    const fakeStore = { login: vi.fn().mockRejectedValue(error) }
    const { form, submitError, submit } = useLoginForm(fakeStore)
    form.email = 'admin@bg.es'
    form.password = 'wrong-pass'

    await submit()

    expect(submitError.value).toBe('Email o contraseña incorrectos')
    expect(form.password).toBe('')
  })

  it('explains in Spanish how long the account is locked (429, BGSI-284)', async () => {
    const error = Object.assign(new Error('Too many failed attempts. Try again in 15 minutes'), {
      status: 429, details: { retryAfterMinutes: '15' },
    })
    const { form, submitError, submit } = useLoginForm({ login: vi.fn().mockRejectedValue(error) })
    form.email = 'admin@bg.es'
    form.password = 'Correct2026'

    await submit()

    expect(submitError.value).toBe('Demasiados intentos fallidos. Vuelve a intentarlo en 15 minutos.')
    expect(form.password).toBe('')
  })

  it('writes "minuto" in singular and has a message without minutes', () => {
    expect(lockedMessage('1')).toBe('Demasiados intentos fallidos. Vuelve a intentarlo en 1 minuto.')
    expect(lockedMessage(undefined)).toBe('Demasiados intentos fallidos. Espera unos minutos y vuelve a intentarlo.')
  })

  // BGSI-276: two-step verification
  describe('second step (2FA)', () => {
    async function atCodeStep(store) {
      const login = useLoginForm(store)
      login.form.email = 'admin@bg.es'
      login.form.password = 'secret123'
      expect(await login.submit()).toBe(false)
      return login
    }

    const twoFactorStore = (verify = vi.fn().mockResolvedValue()) => ({
      login: vi.fn().mockResolvedValue({ twoFactorRequired: true, pendingToken: 'pend' }),
      verifyTwoFactor: verify,
    })

    it('goes to the code step instead of entering', async () => {
      const { step, form } = await atCodeStep(twoFactorStore())

      expect(step.value).toBe('code')
      expect(form.password).toBe('')
    })

    it('asks for the code before calling the backend', async () => {
      const store = twoFactorStore()
      const { errors, submitCode } = await atCodeStep(store)

      expect(await submitCode()).toBe(false)
      expect(errors.code).toBe('Escribe el código de 6 cifras')
      expect(store.verifyTwoFactor).not.toHaveBeenCalled()
    })

    it('enters with the right code', async () => {
      const store = twoFactorStore()
      const { form, submitCode } = await atCodeStep(store)
      form.code = '123456'

      expect(await submitCode()).toBe(true)
      expect(store.verifyTwoFactor).toHaveBeenCalledWith('pend', '123456')
    })

    it('shows the error under the field with a wrong code', async () => {
      const wrong = Object.assign(new Error('x'), { status: 400, details: { code: 'Code is not correct' } })
      const { form, errors, step, submitCode } = await atCodeStep(twoFactorStore(vi.fn().mockRejectedValue(wrong)))
      form.code = '000000'

      expect(await submitCode()).toBe(false)
      expect(errors.code).toBe('Código incorrecto. Comprueba que es el último que muestra la app.')
      expect(step.value).toBe('code')
    })

    it('goes back to the password when the 5 minutes are over or after 5 wrong codes', async () => {
      const expired = Object.assign(new Error('The login has expired'), { status: 400, details: null })
      const first = await atCodeStep(twoFactorStore(vi.fn().mockRejectedValue(expired)))
      first.form.code = '123456'
      await first.submitCode()
      expect(first.step.value).toBe('password')
      expect(first.submitError.value).toBe('Han pasado más de 5 minutos. Vuelve a escribir tu contraseña.')

      const locked = Object.assign(new Error('x'), { status: 429, details: { retryAfterMinutes: '15' } })
      const second = await atCodeStep(twoFactorStore(vi.fn().mockRejectedValue(locked)))
      second.form.code = '123456'
      await second.submitCode()
      expect(second.step.value).toBe('password')
      expect(second.submitError.value).toBe('Demasiados intentos fallidos. Vuelve a intentarlo en 15 minutos.')
    })

    it('can switch to a recovery code and back to the password step', async () => {
      const { useRecoveryCode, toggleRecoveryCode, errors, submitCode, backToPassword, step } = await atCodeStep(twoFactorStore())

      toggleRecoveryCode()
      await submitCode()
      expect(useRecoveryCode.value).toBe(true)
      expect(errors.code).toBe('Escribe un código de recuperación')

      backToPassword()
      expect(step.value).toBe('password')
      expect(useRecoveryCode.value).toBe(false)
    })
  })
})
