import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdminAccountView from '@/views/admin/AdminAccountView.vue'
import { useAuthStore } from '@/stores/auth'
import SessionModel from '@/core/models/auth/SessionModel'

// BGSI-272: "Mi cuenta" screen
describe('AdminAccountView', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    useAuthStore().session = new SessionModel('old-token', 'luisa@bg.es', 'ADMIN')
  })

  it('shows who is logged in and changes the password', async () => {
    const accountService = { changePassword: vi.fn().mockResolvedValue('new-token') }
    const wrapper = mount(AdminAccountView, { props: { accountService } })
    expect(wrapper.text()).toContain('luisa@bg.es')

    await wrapper.find('#account-current').setValue('OldPass2026')
    await wrapper.find('#account-new').setValue('NewPass2026')
    await wrapper.find('form').trigger('submit') // step 1 -> step 2 (BGSI-294)
    await wrapper.find('#account-confirm').setValue('NewPass2026')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(accountService.changePassword).toHaveBeenCalledWith('OldPass2026', 'NewPass2026')
    expect(useAuthStore().token).toBe('new-token')
    expect(wrapper.find('[role="status"]').text()).toContain('Contraseña actualizada')
  })
})
