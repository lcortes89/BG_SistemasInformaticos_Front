import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RowActionsMenu from '@/shared/RowActionsMenu.vue'

const ITEMS = [
  { key: 'edit', label: 'Editar', icon: 'edit' },
  { key: 'delete', label: 'Borrar', icon: 'trash', danger: true },
  { key: 'archive', label: 'Archivar', icon: 'archive' },
]

const menu = () => document.body.querySelector('.row-actions__menu')
const items = () => [...document.body.querySelectorAll('[role="menuitem"]')]

let wrapper
async function mountMenu(props = {}) {
  wrapper = mount(RowActionsMenu, { props: { items: ITEMS, label: 'Acciones de Ana', ...props }, attachTo: document.body })
  return wrapper
}

async function open() {
  await wrapper.find('[data-test="row-actions"]').trigger('click')
  await flushPromises()
}

function key(name) {
  menu().dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }))
}

// BGSI-312: "⋯" menu of the table rows
describe('RowActionsMenu', () => {
  afterEach(() => {
    wrapper?.unmount()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('is a closed button with the name of the row', async () => {
    await mountMenu()

    const toggle = wrapper.find('[data-test="row-actions"]')
    expect(toggle.attributes('aria-label')).toBe('Acciones de Ana')
    expect(toggle.attributes('aria-haspopup')).toBe('menu')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(menu()).toBeNull()
  })

  it('opens the list with the dangerous actions at the end, after a line', async () => {
    await mountMenu()

    await open()

    expect(wrapper.find('[data-test="row-actions"]').attributes('aria-expanded')).toBe('true')
    expect(menu().getAttribute('role')).toBe('menu')
    expect(items().map((item) => item.textContent.trim())).toEqual(['Editar', 'Archivar', 'Borrar'])
    expect(items()[2].classList.contains('row-actions__item--danger')).toBe(true)
    expect(menu().querySelector('[role="separator"]')).not.toBeNull()
    expect(document.activeElement).toBe(items()[0]) // keyboard users start on the first option
  })

  it('has no line when there are no dangerous actions', async () => {
    await mountMenu({ items: [ITEMS[0]] })

    await open()

    expect(menu().querySelector('[role="separator"]')).toBeNull()
  })

  it('emits the chosen action and closes', async () => {
    await mountMenu()
    await open()

    items()[2].click()
    await flushPromises()

    expect(wrapper.emitted('select')[0]).toEqual(['delete'])
    expect(menu()).toBeNull()
    expect(document.activeElement).toBe(wrapper.find('[data-test="row-actions"]').element)
  })

  it('the button opens and closes it', async () => {
    await mountMenu()

    await open()
    await open()

    expect(menu()).toBeNull()
  })

  it('moves with the arrows, Home and End', async () => {
    await mountMenu()
    await open()

    key('ArrowDown')
    expect(document.activeElement).toBe(items()[1])
    key('ArrowDown')
    key('ArrowDown')
    expect(document.activeElement).toBe(items()[0]) // goes round
    key('ArrowUp')
    expect(document.activeElement).toBe(items()[2])
    key('Home')
    expect(document.activeElement).toBe(items()[0])
    key('End')
    expect(document.activeElement).toBe(items()[2])
    key('a') // any other key does nothing
    expect(menu()).not.toBeNull()
  })

  it('Escape closes and goes back to the button', async () => {
    await mountMenu()
    await open()

    key('Escape')
    await flushPromises()

    expect(menu()).toBeNull()
    expect(document.activeElement).toBe(wrapper.find('[data-test="row-actions"]').element)
  })

  it('Tab leaves the menu and closes it', async () => {
    await mountMenu()
    await open()

    key('Tab')
    await flushPromises()

    expect(menu()).toBeNull()
  })

  it('a click outside closes it, a click inside does not', async () => {
    await mountMenu()
    await open()

    menu().dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(menu()).not.toBeNull()
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await flushPromises()

    expect(menu()).toBeNull()
  })

  it('scrolling the page moves it with its button', async () => {
    const rect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ top: 100, bottom: 136, left: 500, right: 536, width: 36, height: 36 })
    await mountMenu()
    await open()

    rect.mockReturnValue({ top: 40, bottom: 76, left: 500, right: 536, width: 36, height: 36 })
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('resize'))
    await flushPromises()

    expect(menu()).not.toBeNull()
    expect(menu().style.top).toBe('82px')
  })

  it('does not open while the row is busy', async () => {
    await mountMenu({ disabled: true })

    await open()

    expect(wrapper.find('[data-test="row-actions"]').attributes('disabled')).toBeDefined()
    expect(menu()).toBeNull()
  })

  it('opens below the button when it fits', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ top: 100, bottom: 136, left: 500, right: 536, width: 36, height: 36 })
    await mountMenu()

    await open()

    expect(menu().style.top).toBe('142px')
  })

  it('opens above the button when it does not fit below (last rows)', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ top: 700, bottom: 736, left: 500, right: 536, width: 36, height: 36 })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(150)
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(220)
    await mountMenu()

    await open()

    expect(menu().style.top).toBe(`${700 - 6 - 150}px`)
    expect(menu().style.left).toBe(`${536 - 220}px`)
  })
})
