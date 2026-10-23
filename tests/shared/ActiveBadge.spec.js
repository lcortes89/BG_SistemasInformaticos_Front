import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActiveBadge from '@/shared/ActiveBadge.vue'

// BGSI-310: same text and colours in the three tables
describe('ActiveBadge', () => {
  it('shows "Activo" in green', () => {
    const wrapper = mount(ActiveBadge, { props: { active: true } })

    expect(wrapper.text()).toBe('Activo')
    expect(wrapper.classes()).toContain('admin-table__badge--on')
  })

  it('shows "Inactivo" in grey', () => {
    const wrapper = mount(ActiveBadge, { props: { active: false } })

    expect(wrapper.text()).toBe('Inactivo')
    expect(wrapper.classes()).toContain('admin-table__badge--off')
  })
})
