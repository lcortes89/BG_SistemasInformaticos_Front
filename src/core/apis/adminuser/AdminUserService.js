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

  async getAll() {
    const list = await this.#repo.findAll()
    return list.map((dto) => this.#toModel(dto))
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
