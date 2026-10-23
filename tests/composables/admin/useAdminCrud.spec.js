import { describe, it, expect, vi } from 'vitest'
import { useAdminCrud } from '@/composables/admin/useAdminCrud'

function fakeService() {
  return {
    getPage: vi.fn().mockResolvedValue({ items: [{ id: 1 }], page: 0, totalPages: 2, totalElements: 11 }),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    remove: vi.fn().mockResolvedValue(),
  }
}

describe('useAdminCrud', () => {
  it('loads a page with the current filters', async () => {
    const service = fakeService()
    const { items, totalElements, setFilter } = useAdminCrud(service)

    await setFilter('brandId', 5)

    expect(service.getPage).toHaveBeenCalledWith(0, 10, { brandId: 5 })
    expect(items.value).toHaveLength(1)
    expect(totalElements.value).toBe(11)
  })

  it('creates when there is no id and updates when there is one', async () => {
    const service = fakeService()
    const { feedback, save } = useAdminCrud(service)

    await save(null, { name: 'New' }, 'Creado')
    await save(7, { name: 'Edited' }, 'Actualizado')

    expect(service.create).toHaveBeenCalledWith({ name: 'New' })
    expect(service.update).toHaveBeenCalledWith(7, { name: 'Edited' })
    expect(feedback.value).toBe('Actualizado')
  })

  it('lets the form handle save errors', async () => {
    const service = { ...fakeService(), create: vi.fn().mockRejectedValue(new Error('Some fields are not valid')) }
    const { isSaving, save } = useAdminCrud(service)

    await expect(save(null, {}, 'Creado')).rejects.toThrow('Some fields are not valid')
    expect(isSaving.value).toBe(false)
  })

  it('shows the friendly conflict message when the backend answers 409', async () => {
    const conflict = Object.assign(new Error('Brand BDP has 3 service(s)'), { status: 409 })
    const service = { ...fakeService(), remove: vi.fn().mockRejectedValue(conflict) }
    const { actionError, remove } = useAdminCrud(service, { conflictMessage: 'Tiene productos' })

    const ok = await remove(1, 'Borrada')

    expect(ok).toBe(false)
    expect(actionError.value).toBe('Tiene productos')
  })

  it('closing "Confirma tu contraseña" is not an error (BGSI-275)', async () => {
    const service = { ...fakeService(), remove: vi.fn().mockRejectedValue(Object.assign(new Error('Acción cancelada'), { cancelled: true })) }
    const { actionError, feedback, remove } = useAdminCrud(service)

    expect(await remove(1, 'Borrada')).toBe(false)
    expect(actionError.value).toBeNull()
    expect(feedback.value).toBeNull()
  })

  // BGSI-310
  it('activates or inactivates and reloads the same page', async () => {
    const service = {
      ...fakeService(),
      getPage: vi.fn().mockImplementation(async (page) => ({ items: [{ id: 4 }], page, totalPages: 3, totalElements: 25 })),
      setActive: vi.fn().mockResolvedValue({}),
    }
    const { feedback, loadPage, setActive } = useAdminCrud(service)
    await loadPage(1)

    expect(await setActive(4, false, 'Inactivado')).toBe(true)

    expect(service.setActive).toHaveBeenCalledWith(4, false)
    expect(feedback.value).toBe('Inactivado')
    expect(service.getPage).toHaveBeenLastCalledWith(1, 10, {})
  })

  it('shows the error when the state cannot be changed', async () => {
    const service = { ...fakeService(), setActive: vi.fn().mockRejectedValue(new Error('Service with id 4 not found')) }
    const { actionError, feedback, setActive } = useAdminCrud(service)

    expect(await setActive(4, true, 'Activado')).toBe(false)

    expect(actionError.value).toBe('Service with id 4 not found')
    expect(feedback.value).toBeNull()
  })
})
