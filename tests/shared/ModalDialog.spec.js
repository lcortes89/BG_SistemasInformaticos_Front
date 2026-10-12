import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ModalDialog from '@/shared/ModalDialog.vue'

describe('ModalDialog', () => {
  it('shows the title and the content, and closes with the X and with Escape', async () => {
    const wrapper = mount(ModalDialog, { props: { title: 'Nueva marca' }, slots: { default: '<p>Contenido</p>' } })

    expect(wrapper.find('[role="dialog"]').text()).toContain('Nueva marca')
    expect(wrapper.text()).toContain('Contenido')

    await wrapper.find('[aria-label="Cerrar"]').trigger('click')
    await wrapper.find('.modal').trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('close')).toHaveLength(2)
  })
})
