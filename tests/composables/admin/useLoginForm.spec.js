import { describe, it, expect, vi } from 'vitest'
import { useLoginForm } from '@/composables/admin/useLoginForm'

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
})
