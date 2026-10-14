import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import DemoSideTab from '@/components/layout/DemoSideTab.vue'
import { routes } from '@/router/routes'

function mountTab(props = {}) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  return mount(DemoSideTab, { props, global: { plugins: [router] } })
}

describe('DemoSideTab (BGSI-236)', () => {
  it('links to the contact page with the demo message', () => {
    const link = mountTab().find('a')

    expect(link.text()).toContain('Demo')
    expect(link.attributes('href')).toBe('/contacto?interes=demo')
  })

  it('slides out and cannot be focused when it is hidden', () => {
    const link = mountTab({ hidden: true }).find('a')

    expect(link.classes()).toContain('is-hidden')
    expect(link.attributes('tabindex')).toBe('-1')
  })
})
