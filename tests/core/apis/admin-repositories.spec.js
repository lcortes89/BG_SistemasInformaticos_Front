import { describe, it, expect, afterEach, vi } from 'vitest'
import { fakeApi } from '../../helpers/fake-api'
import AdminBrandRepository from '@/core/apis/brand/AdminBrandRepository'
import AdminClientRepository from '@/core/apis/client/AdminClientRepository'
import AdminContactRepository from '@/core/apis/contact/AdminContactRepository'
import AdminServiceRepository from '@/core/apis/service/AdminServiceRepository'
import AdminRateQuestionRepository from '@/core/apis/rate/AdminRateQuestionRepository'
import AdminSettingRepository from '@/core/apis/setting/AdminSettingRepository'

// BGSI-266: every admin repository calls the right URL of the API
describe('admin repositories', () => {
  afterEach(() => vi.restoreAllMocks())

  it('brands and clients: page, create, update and delete', async () => {
    const calls = fakeApi({
      'GET /admin/brands': 'ok', 'POST /admin/brands': 'ok', 'PUT /admin/brands/1': 'ok', 'DELETE /admin/brands/1': 'ok',
      'GET /admin/clients': 'ok', 'POST /admin/clients': 'ok', 'PUT /admin/clients/2': 'ok', 'DELETE /admin/clients/2': 'ok',
    })
    const brands = new AdminBrandRepository()
    const clients = new AdminClientRepository()

    await brands.findPage(0, 10); await brands.create({}); await brands.update(1, {}); await brands.remove(1)
    await clients.findPage(0, 10); await clients.create({}); await clients.update(2, {}); await clients.remove(2)

    expect(calls.map((call) => call.key)).toEqual([
      'GET /admin/brands', 'POST /admin/brands', 'PUT /admin/brands/1', 'DELETE /admin/brands/1',
      'GET /admin/clients', 'POST /admin/clients', 'PUT /admin/clients/2', 'DELETE /admin/clients/2',
    ])
  })

  it('services filter by brand and contacts by status', async () => {
    const calls = fakeApi({
      'GET /admin/services': 'ok', 'POST /admin/services': 'ok', 'PUT /admin/services/3': 'ok', 'DELETE /admin/services/3': 'ok',
      'GET /admin/contacts': 'ok', 'PATCH /admin/contacts/4': 'ok',
    })
    const services = new AdminServiceRepository()
    const contacts = new AdminContactRepository()

    await services.findPage(0, 10, 7); await services.create({}); await services.update(3, {}); await services.remove(3)
    await contacts.findPage('NEW', 0, 10); await contacts.update(4, { status: 'CONTACTED' })

    expect(calls[0].body.params).toEqual(expect.objectContaining({ brandId: 7 }))
    expect(calls[4].body.params).toEqual(expect.objectContaining({ status: 'NEW' }))
    expect(calls.map((call) => call.key)).toContain('PATCH /admin/contacts/4')
  })

  it('rate questions and their options', async () => {
    const calls = fakeApi({
      'GET /admin/rate-questions': [], 'POST /admin/rate-questions': 'ok', 'PUT /admin/rate-questions/1': 'ok',
      'DELETE /admin/rate-questions/1': 'ok', 'PUT /admin/rate-questions/order': 'ok',
      'POST /admin/rate-questions/1/options': 'ok', 'PUT /admin/rate-questions/options/9': 'ok',
      'DELETE /admin/rate-questions/options/9': 'ok',
    })
    const repo = new AdminRateQuestionRepository()

    await repo.findAll(); await repo.create({}); await repo.update(1, {}); await repo.remove(1)
    await repo.reorder([2, 1]); await repo.addOption(1, {}); await repo.updateOption(9, {}); await repo.removeOption(9)

    expect(calls).toHaveLength(8)
    expect(calls[4].body).toEqual({ ids: [2, 1] })
  })

  it('settings: hero photo and email notifications', async () => {
    const calls = fakeApi({
      'PUT /admin/settings/hero': 'ok', 'DELETE /admin/settings/hero': 'ok',
      'GET /admin/settings/mail': 'ok', 'PUT /admin/settings/mail': 'ok', 'POST /admin/settings/mail/test': 'ok',
    })
    const repo = new AdminSettingRepository()

    await repo.updateHero('http://x.com/a.jpg'); await repo.resetHero()
    await repo.findMail(); await repo.updateMail({}); await repo.sendTestMail()

    expect(calls.map((call) => call.key)).toEqual([
      'PUT /admin/settings/hero', 'DELETE /admin/settings/hero',
      'GET /admin/settings/mail', 'PUT /admin/settings/mail', 'POST /admin/settings/mail/test',
    ])
  })

  it('keeps the message of the backend when a call fails', async () => {
    fakeApi({})

    await expect(new AdminBrandRepository().remove(1)).rejects.toThrow('Not mocked: DELETE /admin/brands/1')
  })
})
