import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NoteDialog from '@/components/admin/NoteDialog.vue'

describe('NoteDialog', () => {
  it('starts with the current note and saves the trimmed text', async () => {
    const wrapper = mount(NoteDialog, { props: { contactName: 'Ana', initialNote: 'Old' } })

    expect(wrapper.find('textarea').element.value).toBe('Old')
    await wrapper.find('textarea').setValue('  Llamar el lunes  ')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('save')[0]).toEqual(['Llamar el lunes'])
  })

  it('does not save a note longer than 1000 characters', async () => {
    const wrapper = mount(NoteDialog, { props: { contactName: 'Ana' } })

    await wrapper.find('textarea').setValue('a'.repeat(1001))
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('save')).toBeUndefined()
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })
})
