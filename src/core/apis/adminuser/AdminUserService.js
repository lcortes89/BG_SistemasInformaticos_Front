import AdminUserRepository from '@/core/apis/adminuser/AdminUserRepository'
import AdminUserModel from '@/core/models/adminuser/AdminUserModel'
import { adminUserMapper } from '@/core/mappers/adminuser/admin-user-mapper'

export default class AdminUserService {

  #repo

  constructor(repository = new AdminUserRepository()) {
    this.#repo = repository
  }

  #toModel(dto) {
    return AdminUserModel.create(dto, adminUserMapper)
  }

  // BGSI-316: one page of admins, like the other admin lists
  async getPage(page = 0, size = 5) {
    const response = await this.#repo.findPage(page, size)
    return {
      items: response.content.map((dto) => this.#toModel(dto)),
      page: response.page,
      totalPages: response.totalPages,
      totalElements: response.totalElements,
    }
  }

  async invite(email) {
    return this.#toModel(await this.#repo.invite(email.trim().toLowerCase()))
  }

  async resendInvitation(id) {
    await this.#repo.resendInvitation(id)
  }

  async block(id) {
    return this.#toModel(await this.#repo.block(id))
  }

  async unblock(id) {
    return this.#toModel(await this.#repo.unblock(id))
  }

  async resetTwoFactor(id) {
    return this.#toModel(await this.#repo.resetTwoFactor(id))
  }

  async remove(id) {
    await this.#repo.remove(id)
  }
}
