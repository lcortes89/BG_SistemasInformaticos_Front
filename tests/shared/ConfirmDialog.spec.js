import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from '@/shared/ConfirmDialog.vue'

function mountDialog() {
  return mount(ConfirmDialog, {
    props: { title: 'Archivar contacto', message: '¿Seguro?', confirmLabel: 'Archivar' },
    attachTo: document.body,
  })
}

describe('ConfirmDialog', () => {
  it('shows the question and emits confirm', async () => {
    const wrapper = mountDialog()

    expect(wrapper.find('[role="alertdialog"]').text()).toContain('¿Seguro?')
    await wrapper.find('.confirm-dialog__confirm').trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits cancel with the Cancel button and with Escape', async () => {
    const wrapper = mountDialog()

    await wrapper.find('.confirm-dialog__cancel').trigger('click')
    await wrapper.find('.confirm-dialog').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('cancel')).toHaveLength(2)
    wrapper.unmount()
  })
})
