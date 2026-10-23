import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ExpandableText from '@/shared/ExpandableText.vue'

// jsdom does not draw: the height of the text is made up
function textHeight(scrollHeight, clientHeight = 48) {
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(scrollHeight)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(clientHeight)
}

// BGSI-312: long texts of the tables
describe('ExpandableText', () => {
  afterEach(() => vi.restoreAllMocks())

  it('a short text is shown whole, without the link', () => {
    textHeight(40)
    const wrapper = mount(ExpandableText, { props: { text: 'Hola' } })

    expect(wrapper.text()).toBe('Hola')
    expect(wrapper.find('[data-test="toggle-text"]').exists()).toBe(false)
  })

  it('a long text shows 2 lines and "Ver más", which opens and closes it', async () => {
    textHeight(120)
    const wrapper = mount(ExpandableText, { props: { text: 'Un mensaje muy largo...' } })
    await flushPromises()
    const body = wrapper.find('.expandable-text__body')
    const toggle = wrapper.find('[data-test="toggle-text"]')

    expect(body.classes()).toContain('expandable-text__body--clamped')
    expect(body.attributes('style')).toContain('-webkit-line-clamp: 2')
    expect(toggle.text()).toBe('Ver más ▾')
    expect(toggle.attributes('aria-expanded')).toBe('false')

    await toggle.trigger('click')
    expect(body.classes()).not.toContain('expandable-text__body--clamped')
    expect(toggle.text()).toBe('Ver menos ▴')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await toggle.trigger('click')
    expect(body.classes()).toContain('expandable-text__body--clamped')
  })

  it('accepts another number of lines', () => {
    textHeight(40)
    const wrapper = mount(ExpandableText, { props: { text: 'Hola', lines: 3 } })

    expect(wrapper.find('.expandable-text__body').attributes('style')).toContain('-webkit-line-clamp: 3')
  })

  it('closes again when the text changes', async () => {
    textHeight(120)
    const wrapper = mount(ExpandableText, { props: { text: 'Uno muy largo' } })
    await flushPromises()
    await wrapper.find('[data-test="toggle-text"]').trigger('click')

    await wrapper.setProps({ text: 'Otro muy largo' })
    await flushPromises()

    expect(wrapper.find('.expandable-text__body').classes()).toContain('expandable-text__body--clamped')
    expect(wrapper.find('[data-test="toggle-text"]').text()).toBe('Ver más ▾')
  })

  it('measures again when the size changes (ResizeObserver)', () => {
    const observe = vi.fn()
    const disconnect = vi.fn()
    vi.stubGlobal('ResizeObserver', vi.fn(function ResizeObserver(callback) {
      this.observe = observe
      this.disconnect = disconnect
      this.callback = callback
    }))
    textHeight(40)
    const wrapper = mount(ExpandableText, { props: { text: 'Hola' } })

    expect(observe).toHaveBeenCalled()
    wrapper.unmount()
    expect(disconnect).toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
