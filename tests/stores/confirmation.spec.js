import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useConfirmationStore } from '@/stores/confirmation'

// BGSI-275: token of "Confirma tu contraseña", 5 minutes, only in memory
describe('confirmation store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('has no token at the start', () => {
    expect(useConfirmationStore().validToken('luisa@bg.es')).toBeNull()
  })

  it('keeps the token for the given seconds and only for the admin who confirmed', () => {
    const store = useConfirmationStore()
    store.confirmed('tok', 300, 'luisa@bg.es', 1_000)

    expect(store.validToken('luisa@bg.es', 1_000)).toBe('tok')
    expect(store.validToken('luisa@bg.es', 1_000 + 299_000)).toBe('tok')
    expect(store.validToken('luisa@bg.es', 1_000 + 300_000)).toBeNull()
    expect(store.validToken('otra@bg.es', 1_000)).toBeNull()
  })

  it('request opens the dialog and resolves every waiting request with the new token', async () => {
    const store = useConfirmationStore()
    const first = store.request()
    const second = store.request()
    expect(store.isOpen).toBe(true)

    store.confirmed('tok', 300, 'luisa@bg.es')

    await expect(first).resolves.toBe('tok')
    await expect(second).resolves.toBe('tok')
    expect(store.isOpen).toBe(false)
  })

  it('cancel closes the dialog and rejects with a cancelled error', async () => {
    const store = useConfirmationStore()
    const waiting = store.request()

    store.cancel()

    await expect(waiting).rejects.toMatchObject({ cancelled: true })
    expect(store.isOpen).toBe(false)
  })

  it('clear forgets the token (logout)', () => {
    const store = useConfirmationStore()
    store.confirmed('tok', 300, 'luisa@bg.es')

    store.clear()

    expect(store.validToken('luisa@bg.es')).toBeNull()
  })
})
