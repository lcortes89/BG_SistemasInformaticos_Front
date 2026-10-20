import AccountRepository from '@/core/apis/account/AccountRepository'

export default class AccountService {

  #repo

  constructor(repository = new AccountRepository()) {
    this.#repo = repository
  }

  // Returns the new JWT: the backend closes every older session (BGSI-272)
  async changePassword(currentPassword, newPassword) {
    const dto = await this.#repo.changePassword(currentPassword, newPassword)
    return dto.token
  }
}
