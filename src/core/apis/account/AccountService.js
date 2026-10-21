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
  async confirmPassword(password, code = null) {
    const dto = await this.#repo.confirmPassword(password, code?.trim() || null)
    return { token: dto.confirmToken, expiresInSeconds: dto.expiresInSeconds }
  }

  // BGSI-276: two-step verification
  async getTwoFactor() {
    const dto = await this.#repo.getTwoFactor()
    return { enabled: dto.enabled, recoveryCodesLeft: dto.recoveryCodesLeft }
  }

  async setupTwoFactor() {
    const dto = await this.#repo.setupTwoFactor()
    return { secret: dto.secret, otpauthUri: dto.otpauthUri }
  }

  // Returns the 10 recovery codes (shown only once)
  async enableTwoFactor(code) {
    const dto = await this.#repo.enableTwoFactor(code.trim())
    return dto.recoveryCodes
  }

  async disableTwoFactor() {
    await this.#repo.disableTwoFactor()
  }
}
