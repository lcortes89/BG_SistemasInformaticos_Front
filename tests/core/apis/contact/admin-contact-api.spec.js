import { describe, it, expect, afterEach, vi } from 'vitest'
import { fakeApi } from '../../../helpers/fake-api'
import AdminContactService from '@/core/apis/contact/AdminContactService'

// BGSI-308: DELETE /api/admin/contacts/{id}
describe('AdminContactService: delete', () => {
  afterEach(() => vi.restoreAllMocks())

  it('calls DELETE with the id of the contact', async () => {
    const calls = fakeApi({ 'DELETE /admin/contacts/4': '' })

    await new AdminContactService().remove(4)

    expect(calls.map((call) => call.key)).toEqual(['DELETE /admin/contacts/4'])
  })
})
