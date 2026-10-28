import AuthRepository from '@/core/apis/auth/AuthRepository'
import SessionModel from '@/core/models/auth/SessionModel'
import { authMapper } from '@/core/mappers/auth/auth-mapper'

export default class AuthService {

  #repo

  constructor(repository = new AuthRepository()) {
    this.#repo = repository
  }

  // Returns the session, or (BGSI-276, 2FA on) { twoFactorRequired: true, pendingToken } to ask for the code
  async login(email, password) {
    const dto = await this.#repo.login(email.trim(), password)
    if (dto.twoFactorRequired) return { twoFactorRequired: true, pendingToken: dto.pendingToken }
    return SessionModel.create(dto, authMapper)
  }

  // BGSI-276: the 6-digit code (or a recovery code) after the password
  async verifyTwoFactor(pendingToken, code) {
    const dto = await this.#repo.verifyTwoFactor(pendingToken, code.trim())
    return SessionModel.create(dto, authMapper)
  }

  // BGSI-273: asks for the "create a new password" email
  async forgotPassword(email) {
    await this.#repo.forgotPassword(email.trim())
  }

  // BGSI-273: sets the new password with the token of the email link
  async resetPassword(token, newPassword) {
    await this.#repo.resetPassword(token, newPassword)
  }

  // BGSI-299: opens the link of "change my email". Returns the new email
  async confirmEmailChange(token) {
    const dto = await this.#repo.confirmEmailChange(token)
    return dto.email
  }
}
