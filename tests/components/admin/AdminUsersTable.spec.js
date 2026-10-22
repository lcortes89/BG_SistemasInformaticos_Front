import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import AdminUsersTable from '@/components/admin/AdminUsersTable.vue'
import AdminUserModel from '@/core/models/adminuser/AdminUserModel'

const me = new AdminUserModel(1, 'luisa@bg.es', 'ACTIVE', true, '2026-10-22T06:55:00Z', true)
const active = new AdminUserModel(2, 'maria@bg.es', 'ACTIVE', true, null, false)
const pending = new AdminUserModel(3, 'pedro@bg.es', 'PENDING', false, null, false)
const blocked = new AdminUserModel(4, 'carlos@bg.es', 'BLOCKED', false, null, false)

const mountTable = (admins, busyId = null) => mount(AdminUsersTable, {
  props: { admins, busyId },
  global: { stubs: { RouterLink: RouterLinkStub } },
})
const buttons = (wrapper, id) => wrapper.find(`[data-test="admin-${id}"]`).findAll('button').map((b) => b.text())

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

  it('offers the actions that fit each status', () => {
    const wrapper = mountTable([active, pending, blocked])

    expect(buttons(wrapper, 2)).toEqual(['Bloquear', 'Quitar 2FA', 'Borrar'])
    expect(buttons(wrapper, 3)).toEqual(['Reenviar invitación', 'Borrar'])
    expect(buttons(wrapper, 4)).toEqual(['Desbloquear', 'Borrar'])
  })

  it('has no actions on your own row, only the link to Mi cuenta', () => {
    const wrapper = mountTable([me])

    expect(buttons(wrapper, 1)).toEqual([])
    expect(wrapper.find('[data-test="admin-1"]').text()).toContain('Tú')
    expect(wrapper.findComponent(RouterLinkStub).props('to')).toEqual({ name: 'admin-account' })
  })

  it('emits the action with the admin', async () => {
    const wrapper = mountTable([active])

    await wrapper.find('[data-test="admin-2"] .admin-table__action--danger').trigger('click')

    expect(wrapper.emitted('action')[0]).toEqual(['remove', active])
  })

  it('disables the buttons of the row whose action is running', () => {
    const wrapper = mountTable([active, pending], 2)

    expect(wrapper.find('[data-test="admin-2"] button').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-test="admin-3"] button').attributes('disabled')).toBeUndefined()
  })
})
