import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ExportMenu from '@/shared/ExportMenu.vue'

function mountMenu(exportService, props = {}) {
  return mount(ExportMenu, {
    props: { resource: 'clients', exportService, ...props },
    attachTo: document.body,
  })
}

describe('ExportMenu', () => {
  it('opens the menu with the PDF and Excel options', async () => {
    const wrapper = mountMenu({ download: vi.fn() })

    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    await wrapper.find('.export__toggle').trigger('click')

    const options = wrapper.findAll('[role="menuitem"]')
    expect(options.map((option) => option.text())).toEqual([
      expect.stringContaining('Descargar PDF'),
      expect.stringContaining('Descargar Excel'),
    ])
    wrapper.unmount()
  })

  it('downloads the chosen format with the filters and closes the menu', async () => {
    const exportService = { download: vi.fn().mockResolvedValue('productos.xlsx') }
    const wrapper = mountMenu(exportService, { resource: 'services', params: { brandId: 2 } })

    await wrapper.find('.export__toggle').trigger('click')
    await wrapper.findAll('[role="menuitem"]')[1].trigger('click')
    await flushPromises()

    expect(exportService.download).toHaveBeenCalledWith('services', 'xlsx', { brandId: 2 })
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('shows "Exportando…" while the file is being generated', async () => {
    let finish
    const exportService = { download: vi.fn(() => new Promise((resolve) => { finish = resolve })) }
    const wrapper = mountMenu(exportService)

    await wrapper.find('.export__toggle').trigger('click')
    await wrapper.findAll('[role="menuitem"]')[0].trigger('click')

    expect(wrapper.find('.export__toggle').text()).toBe('Exportando…')
    expect(wrapper.find('.export__toggle').attributes('disabled')).toBeDefined()

    finish()
    await flushPromises()
    expect(wrapper.find('.export__toggle').text()).toContain('Exportar')
    wrapper.unmount()
  })

  it('shows the error when the download fails', async () => {
    const exportService = { download: vi.fn().mockRejectedValue(new Error('Ha ocurrido un error en el servidor.')) }
    const wrapper = mountMenu(exportService)

    await wrapper.find('.export__toggle').trigger('click')
    await wrapper.findAll('[role="menuitem"]')[0].trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe('Ha ocurrido un error en el servidor.')
    wrapper.unmount()
  })

  it('closes with Escape and with a click outside', async () => {
    const wrapper = mountMenu({ download: vi.fn() })

    await wrapper.find('.export__toggle').trigger('click')
    await wrapper.find('.export').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)

    await wrapper.find('.export__toggle').trigger('click')
    document.body.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    wrapper.unmount()
  })
})
