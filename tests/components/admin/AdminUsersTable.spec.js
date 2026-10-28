import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import AdminUsersTable from '@/components/admin/AdminUsersTable.vue'
import AdminUserModel from '@/core/models/adminuser/AdminUserModel'
import { chooseRowAction, rowActionLabels } from '../../helpers/row-actions'

const me = new AdminUserModel(1, 'luisa@bg.es', 'ACTIVE', true, '2026-10-22T06:55:00Z', true)
const active = new AdminUserModel(2, 'maria@bg.es', 'ACTIVE', true, null, false)
const pending = new AdminUserModel(3, 'pedro@bg.es', 'PENDING', false, null, false)
const blocked = new AdminUserModel(4, 'carlos@bg.es', 'BLOCKED', false, null, false)

const mountTable = (admins, busyId = null) => mount(AdminUsersTable, {
  props: { admins, busyId },
  global: { stubs: { RouterLink: RouterLinkStub } },
})
const row = (wrapper, id) => wrapper.find(`[data-test="admin-${id}"]`)

// BGSI-277
describe('AdminUsersTable', () => {
  it('shows the status, the 2FA and the last login of each admin', () => {
    const wrapper = mountTable([active, pending, blocked])

    expect(wrapper.find('[data-test="admin-2"]').text()).toContain('Activo')
    expect(wrapper.find('[data-test="admin-2"]').text()).toContain('✓ Activada')
    expect(wrapper.find('[data-test="admin-3"]').text()).toContain('Pendiente')
    expect(wrapper.find('[data-test="admin-3"]').text()).toContain('Nunca')
    expect(wrapper.find('[data-test="admin-4"]').text()).toContain('Bloqueado')
    expect(wrapper.find('[data-test="admin-4"]').text()).toContain('No activada')
  })

  // BGSI-312: in the "⋯" menu, only the actions that fit the status
  it('offers the actions that fit each status', async () => {
    const wrapper = mountTable([active, pending, blocked])

    expect(await rowActionLabels(row(wrapper, 2))).toEqual(['Bloquear', 'Quitar doble verificación', 'Borrar'])
    expect(await rowActionLabels(row(wrapper, 3))).toEqual(['Reenviar invitación', 'Borrar'])
    expect(await rowActionLabels(row(wrapper, 4))).toEqual(['Desbloquear', 'Borrar'])
  })

  it('has no actions on your own row, only the link to Ajustes de perfil', () => {
    const wrapper = mountTable([me])

    expect(row(wrapper, 1).find('[data-test="row-actions"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="admin-1"]').text()).toContain('Tú')
    expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({ name: 'admin-change-password' }) // BGSI-314
    expect(wrapper.findComponent(RouterLinkStub).text()).toBe('Ir a Ajustes de perfil →')
  })

  it('emits the action with the admin', async () => {
    const wrapper = mountTable([active])

    await chooseRowAction(row(wrapper, 2), 'Borrar')

    expect(wrapper.emitted('action')[0]).toEqual(['remove', active])
  })

  it('disables the menu of the row whose action is running', () => {
    const wrapper = mountTable([active, pending], 2)

    expect(row(wrapper, 2).find('[data-test="row-actions"]').attributes('disabled')).toBeDefined()
    expect(row(wrapper, 3).find('[data-test="row-actions"]').attributes('disabled')).toBeUndefined()
  })
})
