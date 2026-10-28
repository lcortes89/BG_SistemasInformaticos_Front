import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('is accessible and shows the default label', () => {
    const wrapper = mount(LoadingSpinner)

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toContain('Cargando...')
  })

  it('shows a custom label', () => {
    const wrapper = mount(LoadingSpinner, { props: { label: 'Cargando servicios...' } })

    expect(wrapper.text()).toContain('Cargando servicios...')
  })
})
