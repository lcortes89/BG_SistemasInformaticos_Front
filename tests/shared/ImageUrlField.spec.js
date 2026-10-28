import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ImageUrlField from '@/shared/ImageUrlField.vue'

function mountField(uploadService, modelValue = '') {
  return mount(ImageUrlField, { props: { id: 'logo', label: 'Logo', modelValue, uploadService } })
}

// Simulates the admin choosing a file in the hidden <input type="file">
async function chooseFile(wrapper, file) {
  const input = wrapper.find('input[type="file"]')
  Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
  await input.trigger('change')
  await flushPromises()
}

describe('ImageUrlField', () => {
  it('emits the typed URL', async () => {
    const wrapper = mountField({ uploadImage: vi.fn() })

    await wrapper.find('#logo').setValue('https://example.com/logo.png')

    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['https://example.com/logo.png'])
  })

  it('uploads the chosen file and emits its URL', async () => {
    const uploadService = { uploadImage: vi.fn().mockResolvedValue('http://localhost:8080/uploads/abc.png') }
    const wrapper = mountField(uploadService)

    await chooseFile(wrapper, { name: 'logo.png', type: 'image/png', size: 100 })

    expect(uploadService.uploadImage).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['http://localhost:8080/uploads/abc.png'])
  })

  it('shows the upload error', async () => {
    const uploadService = { uploadImage: vi.fn().mockRejectedValue(new Error('La imagen no puede superar los 2 MB')) }
    const wrapper = mountField(uploadService)

    await chooseFile(wrapper, { name: 'big.png', type: 'image/png', size: 9e6 })

    expect(wrapper.find('[role="alert"]').text()).toBe('La imagen no puede superar los 2 MB')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('shows the preview when there is a URL', () => {
    const wrapper = mountField({ uploadImage: vi.fn() }, 'https://example.com/logo.png')

    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/logo.png')
  })
})
