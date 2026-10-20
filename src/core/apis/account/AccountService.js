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

  // BGSI-275: token to send in X-Confirm-Token during the next 5 minutes
  async confirmPassword(password) {
    const dto = await this.#repo.confirmPassword(password)
    return { token: dto.confirmToken, expiresInSeconds: dto.expiresInSeconds }
  }
}
