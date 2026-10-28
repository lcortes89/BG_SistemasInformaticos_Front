import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TwoFactorCard from '@/components/admin/TwoFactorCard.vue'

function fakeService(enabled = false) {
  return {
    getTwoFactor: vi.fn().mockResolvedValue({ enabled, recoveryCodesLeft: enabled ? 10 : 0 }),
    setupTwoFactor: vi.fn().mockResolvedValue({ secret: 'ABCDEFGHIJKLMNOP', otpauthUri: 'otpauth://totp/x' }),
    enableTwoFactor: vi.fn().mockResolvedValue(['k7mp-3xqa', 'h4tz-9wrc']),
    disableTwoFactor: vi.fn().mockResolvedValue(),
  }
}

const toQr = vi.fn().mockResolvedValue('data:image/png;base64,QR')

async function mountCard(service = fakeService()) {
  const wrapper = mount(TwoFactorCard, { props: { service, toQr } })
  await flushPromises()
  return wrapper
}

// BGSI-276
describe('TwoFactorCard', () => {
  afterEach(() => vi.restoreAllMocks())

  it('explains it and offers to turn it on', async () => {
    const wrapper = await mountCard()

    expect(wrapper.text()).toContain('Desactivada')
    expect(wrapper.find('[data-test="start"]').exists()).toBe(true)
  })

  it('shows the QR with the key in groups of 4, then the codes', async () => {
    const service = fakeService()
    const wrapper = await mountCard(service)

    await wrapper.find('[data-test="start"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('.two-factor__qr img').attributes('src')).toBe('data:image/png;base64,QR')
    expect(wrapper.find('[data-test="secret"]').text()).toBe('ABCD EFGH IJKL MNOP')

    await wrapper.find('#two-factor-code').setValue('123456')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(service.enableTwoFactor).toHaveBeenCalledWith('123456')
    expect(wrapper.findAll('.two-factor__codes li')).toHaveLength(2)
    expect(wrapper.find('[data-test="done"]').attributes('disabled')).toBeDefined()
  })

  it('"Ya los he guardado" works after copying the codes', async () => {
    const writeText = vi.fn().mockResolvedValue()
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const wrapper = await mountCard()
    await wrapper.find('[data-test="start"]').trigger('click')
    await flushPromises()
    await wrapper.find('#two-factor-code').setValue('123456')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await wrapper.find('[data-test="copy"]').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('k7mp-3xqa'))
    expect(wrapper.find('[data-test="copy"]').text()).toBe('✓ Copiados')

    await wrapper.find('[data-test="done"]').trigger('click')
    expect(wrapper.text()).toContain('Activada')
    expect(wrapper.text()).toContain('2 códigos de recuperación')
    vi.unstubAllGlobals()
  })

  it('downloading the codes also lets you continue', async () => {
    URL.createObjectURL = vi.fn().mockReturnValue('blob:codes')
    URL.revokeObjectURL = vi.fn()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const wrapper = await mountCard()
    await wrapper.find('[data-test="start"]').trigger('click')
    await flushPromises()
    await wrapper.find('#two-factor-code').setValue('123456')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await wrapper.find('[data-test="download"]').trigger('click')

    expect(click).toHaveBeenCalled()
    expect(wrapper.find('[data-test="done"]').attributes('disabled')).toBeUndefined()
  })

  it('when it is on, shows the codes left and can be turned off', async () => {
    const service = fakeService(true)
    const wrapper = await mountCard(service)
    expect(wrapper.text()).toContain('Activada')
    expect(wrapper.text()).toContain('10 códigos de recuperación')

    await wrapper.find('[data-test="disable"]').trigger('click')
    await flushPromises()

    expect(service.disableTwoFactor).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Verificación en dos pasos desactivada.')
  })

  // BGSI-314: on its own page the title is the one of the page
  it('can hide its title (only for screen readers) and keeps the badge', async () => {
    const wrapper = mount(TwoFactorCard, { props: { service: fakeService(), toQr, hideTitle: true } })
    await flushPromises()

    expect(wrapper.find('h2').classes()).toContain('sr-only')
    expect(wrapper.text()).toContain('Desactivada')
  })
})
