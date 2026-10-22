import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { useMobileMenu } from '@/composables/layout/useMobileMenu'

// A small component: a "menu" box and a button outside of it
function mountMenu() {
  let menu
  const Host = defineComponent({
    setup() {
      const root = ref(null)
      menu = useMobileMenu(root)
      return () => h('div', [h('nav', { ref: root, class: 'menu' }, 'menu'), h('p', { class: 'outside' }, 'page')])
    },
  })
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: Host }, { path: '/b', component: Host }] })
  const wrapper = mount(Host, { global: { plugins: [router] }, attachTo: document.body })
  return { wrapper, router, menu: () => menu }
}

// BGSI-298
describe('useMobileMenu', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('opens and closes with toggle', () => {
    const { menu } = mountMenu()

    menu().toggle()
    expect(menu().isOpen.value).toBe(true)
    menu().toggle()
    expect(menu().isOpen.value).toBe(false)
  })

  it('closes with Esc', () => {
    const { menu } = mountMenu()
    menu().toggle()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(menu().isOpen.value).toBe(false)
  })

  it('closes when touching outside, not inside the menu', () => {
    const { wrapper, menu } = mountMenu()
    menu().toggle()

    wrapper.find('.menu').element.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(menu().isOpen.value).toBe(true)

    wrapper.find('.outside').element.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(menu().isOpen.value).toBe(false)
  })

  it('closes when going to another page', async () => {
    const { router, menu } = mountMenu()
    await router.isReady()
    menu().toggle()

    await router.push('/b')
    await flushPromises()

    expect(menu().isOpen.value).toBe(false)
  })

  it('stops listening when the component is removed', () => {
    const { wrapper, menu } = mountMenu()
    const state = menu()
    state.toggle()
    wrapper.unmount()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(state.isOpen.value).toBe(true)
  })
})
