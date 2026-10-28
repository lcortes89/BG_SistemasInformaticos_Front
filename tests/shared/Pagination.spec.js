import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '@/shared/Pagination.vue'

describe('Pagination', () => {
  it('is hidden when there is only one page', () => {
    const wrapper = mount(Pagination, { props: { currentPage: 0, totalPages: 1 } })

    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('shows one button per page and marks the current one', () => {
    const wrapper = mount(Pagination, { props: { currentPage: 1, totalPages: 3 } })

    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('2')
  })

  it('emits "change" with the next page index', async () => {
    const wrapper = mount(Pagination, { props: { currentPage: 0, totalPages: 3 } })

    await wrapper.findAll('button').at(-1).trigger('click') // "Siguiente"

    expect(wrapper.emitted('change')[0]).toEqual([1])
  })

  it('disables "Anterior" on the first page', () => {
    const wrapper = mount(Pagination, { props: { currentPage: 0, totalPages: 3 } })

    expect(wrapper.findAll('button').at(0).attributes('disabled')).toBeDefined()
  })
})
