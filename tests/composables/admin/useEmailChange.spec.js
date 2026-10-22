import { describe, it, expect, vi } from 'vitest'
import { expiryText, useEmailChange } from '@/composables/admin/useEmailChange'

const PENDING = { newEmail: 'new@bg.es', expiresAt: new Date('2026-10-22T13:00:00Z') }

function fakeService(overrides = {}) {
  return {
    getPendingEmailChange: vi.fn().mockResolvedValue(null),
    requestEmailChange: vi.fn().mockResolvedValue(PENDING),
    cancelEmailChange: vi.fn().mockResolvedValue(),
    ...overrides,
  }
}

function fill(state, email, repeated = email) {
  state.form.newEmail = email
  state.next()
  state.form.confirmEmail = repeated
}

// BGSI-301
describe('useEmailChange', () => {
  it('shows the form when nothing is pending', async () => {
    const state = useEmailChange(fakeService(), () => 'me@bg.es')

    await state.load()

    expect(state.view.value).toBe('form')
  })

  it('shows the pending change', async () => {
    const state = useEmailChange(fakeService({ getPendingEmailChange: vi.fn().mockResolvedValue(PENDING) }))

    await state.load()

    expect(state.view.value).toBe('pending')
    expect(state.pending.value).toEqual(PENDING)
  })

  it('still shows the form when the pending change cannot be read', async () => {
    const state = useEmailChange(fakeService({ getPendingEmailChange: vi.fn().mockRejectedValue(new Error('x')) }))

    await state.load()

    expect(state.view.value).toBe('form')
  })

  it('checks the first step: empty, format and the current email', () => {
    const state = useEmailChange(fakeService(), () => 'me@bg.es')

    expect(state.next()).toBe(false)
    expect(state.errors.newEmail).toBe('Escribe el email nuevo')
    state.form.newEmail = 'wrong'
    expect(state.next()).toBe(false)
    expect(state.errors.newEmail).toBe('El formato del email no es válido')
    state.form.newEmail = ' ME@bg.es '
    expect(state.next()).toBe(false)
    expect(state.errors.newEmail).toBe('Es el email que ya usas')
    state.form.newEmail = 'new@bg.es'
    expect(state.next()).toBe(true)
    expect(state.step.value).toBe(2)
  })

  it('does not send when the repeated email is empty or different', async () => {
    const service = fakeService()
    const state = useEmailChange(service, () => 'me@bg.es')

    fill(state, 'new@bg.es', '')
    expect(await state.submit()).toBe(false)
    expect(state.errors.confirmEmail).toBe('Repite el email nuevo')
    state.form.confirmEmail = 'other@bg.es'
    expect(await state.submit()).toBe(false)
    expect(state.errors.confirmEmail).toBe('Los dos emails no coinciden')
    expect(service.requestEmailChange).not.toHaveBeenCalled()
  })

  it('sends the link and shows the pending change', async () => {
    const service = fakeService()
    const state = useEmailChange(service, () => 'me@bg.es')
    fill(state, 'new@bg.es', 'NEW@bg.es')

    expect(await state.submit()).toBe(true)

    expect(service.requestEmailChange).toHaveBeenCalledWith('new@bg.es')
    expect(state.view.value).toBe('pending')
    expect(state.pending.value).toEqual(PENDING)
    expect(state.form.newEmail).toBe('')
    expect(state.step.value).toBe(1)
  })

  it('back empties the repeated email', () => {
    const state = useEmailChange(fakeService(), () => 'me@bg.es')
    fill(state, 'new@bg.es')

    state.back()

    expect(state.form.confirmEmail).toBe('')
    expect(state.step.value).toBe(1)
  })

  it.each([
    [{ cancelled: true }, null],
    [{ status: 409 }, 'Ese email ya lo usa otro administrador'],
    [{ status: 400, details: { newEmail: 'x' } }, 'El formato del email no es válido'],
    [{ status: 400 }, 'Es el email que ya usas'],
    [{ status: 500, message: 'Error del servidor' }, 'Error del servidor'],
  ])('explains the error %o', async (error, message) => {
    const state = useEmailChange(fakeService({ requestEmailChange: vi.fn().mockRejectedValue(error) }), () => 'me@bg.es')
    fill(state, 'new@bg.es')

    expect(await state.submit()).toBe(false)

    expect(state.submitError.value).toBe(message)
    expect(state.form.newEmail).toBe('new@bg.es') // the form is kept
  })

  it('cancels the pending change', async () => {
    const service = fakeService({ getPendingEmailChange: vi.fn().mockResolvedValue(PENDING) })
    const state = useEmailChange(service)
    await state.load()

    await state.cancel()

    expect(service.cancelEmailChange).toHaveBeenCalled()
    expect(state.view.value).toBe('form')
    expect(state.pending.value).toBeNull()
    expect(state.feedback.value).toContain('Cambio cancelado')
  })

  it('keeps the pending change when cancelling fails', async () => {
    const service = fakeService({
      getPendingEmailChange: vi.fn().mockResolvedValue(PENDING),
      cancelEmailChange: vi.fn().mockRejectedValue(new Error('Sin conexión')),
    })
    const state = useEmailChange(service)
    await state.load()

    await state.cancel()

    expect(state.view.value).toBe('pending')
    expect(state.submitError.value).toBe('Sin conexión')
  })
})

describe('expiryText', () => {
  it('says only the time when it is today', () => {
    const date = new Date(2026, 9, 22, 15, 42)

    expect(expiryText(date, new Date(2026, 9, 22, 14, 42))).toBe('antes de las 15:42')
  })

  it('adds the day when it is another day', () => {
    const date = new Date(2026, 9, 23, 0, 15)

    expect(expiryText(date, new Date(2026, 9, 22, 23, 15))).toBe('antes del 23/10 a las 00:15')
  })
})
