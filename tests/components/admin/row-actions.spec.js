import { describe, it, expect } from 'vitest'
import { editToggleDeleteActions } from '@/components/admin/row-actions'

// BGSI-310: the "⋯" menu changes with the state of the row
describe('editToggleDeleteActions', () => {
  it('offers "Inactivar" when the row is active', () => {
    expect(editToggleDeleteActions(true).map((action) => action.label)).toEqual(['Editar', 'Inactivar', 'Borrar'])
  })

  it('offers "Activar" when the row is inactive', () => {
    const actions = editToggleDeleteActions(false)

    expect(actions[1]).toEqual({ key: 'toggle', label: 'Activar', icon: 'eye' })
    expect(actions[2].danger).toBe(true)
  })
})
