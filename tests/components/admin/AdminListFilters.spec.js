import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AdminListFilters from '@/components/admin/AdminListFilters.vue'
import { ACTIVE_OPTIONS } from '@/components/admin/list-filter-options'

// BGSI-302: search box + status of the admin lists
function mountFilters(props = {}) {
  return mount(AdminListFilters, {
    props: { statusOptions: ACTIVE_OPTIONS, placeholder: 'Buscar por nombre', ...props },
  })
}

describe('AdminListFilters', () => {
  afterEach(() => vi.useRealTimers())

  it('sends the text a moment after the user stops typing, without spaces', async () => {
    vi.useFakeTimers()
    const wrapper = mountFilters()

    await wrapper.find('[data-test="filter-search"]').setValue('  bar ')
    expect(wrapper.emitted('update:search')).toBeUndefined()

    vi.advanceTimersByTime(350)
    expect(wrapper.emitted('update:search')).toEqual([['bar']])
  })

  it('sends the text at once with Enter', async () => {
    vi.useFakeTimers()
    const wrapper = mountFilters()
    const input = wrapper.find('[data-test="filter-search"]')

    await input.setValue('plaza')
    await input.trigger('keydown', { key: 'Enter' })
    vi.advanceTimersByTime(1000)

    expect(wrapper.emitted('update:search')).toEqual([['plaza']])
  })

  it('sends the real value of the status (true, false or null), not a string', async () => {
    const wrapper = mountFilters()
    const options = wrapper.find('[data-test="filter-status"]').findAll('option')

    await options[2].setSelected() // Inactivos
    await options[0].setSelected() // Todos los estados

    expect(wrapper.emitted('update:status')).toEqual([[false], [null]])
    expect(wrapper.find('input').attributes('placeholder')).toBe('Buscar por nombre')
  })

  it('shows "Limpiar filtros" only when there is a filter', async () => {
    const wrapper = mountFilters()
    expect(wrapper.find('[data-test="filter-clear"]').exists()).toBe(false)

    await wrapper.setProps({ status: true })
    expect(wrapper.find('[data-test="filter-clear"]').exists()).toBe(true)

    await wrapper.setProps({ status: null, search: 'bar' })
    expect(wrapper.find('[data-test="filter-clear"]').exists()).toBe(true)

    await wrapper.setProps({ search: '', otherFiltersActive: true }) // e.g. the brand in Productos
    expect(wrapper.find('[data-test="filter-clear"]').exists()).toBe(true)
  })

  it('"Limpiar filtros" empties the box and asks the page to clear', async () => {
    vi.useFakeTimers()
    const wrapper = mountFilters({ search: 'bar' })
    await wrapper.find('[data-test="filter-search"]').setValue('bars')

    await wrapper.find('[data-test="filter-clear"]').trigger('click')
    vi.advanceTimersByTime(1000)

    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(wrapper.emitted('update:search')).toBeUndefined() // the pending text is not sent
    expect(wrapper.find('input').element.value).toBe('')
  })

  it('shows the text the page has (e.g. after clearing from the empty list)', async () => {
    const wrapper = mountFilters({ search: 'bar' })
    expect(wrapper.find('input').element.value).toBe('bar')

    await wrapper.setProps({ search: '' })
    expect(wrapper.find('input').element.value).toBe('')
  })

  it('has room for other filters of the page', () => {
    const wrapper = mount(AdminListFilters, {
      props: { statusOptions: ACTIVE_OPTIONS, placeholder: 'Buscar' },
      slots: { default: '<select id="brand-filter"><option>Todas las marcas</option></select>' },
    })

    expect(wrapper.find('#brand-filter').exists()).toBe(true)
  })
})
