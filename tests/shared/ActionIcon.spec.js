import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActionIcon from '@/shared/ActionIcon.vue'

// BGSI-312: icons of the row menus
describe('ActionIcon', () => {
  it('draws the icon, hidden from screen readers', () => {
    const wrapper = mount(ActionIcon, { props: { name: 'trash' } })

    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.findAll('path').length).toBeGreaterThan(1)
  })

  it.each(['check', 'note', 'edit', 'archive', 'restore', 'mail', 'lock', 'unlock', 'shield', 'eye', 'eye-off'])(
    'has the icon %s', (name) => {
      expect(mount(ActionIcon, { props: { name } }).findAll('path').length).toBeGreaterThan(0)
    })

  it('an unknown name draws nothing', () => {
    expect(mount(ActionIcon, { props: { name: 'nope' } }).findAll('path')).toHaveLength(0)
  })
})
