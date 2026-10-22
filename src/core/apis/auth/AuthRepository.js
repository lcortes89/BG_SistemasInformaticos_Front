import BaseRepository from '@/core/apis/base/BaseRepository'

export default class AuthRepository extends BaseRepository {

  constructor() {
    super('/auth')
  }

  // POST /api/auth/login with HTTP Basic (email + password) -> { token, email, role }
  async login(email, password) {
    return this.post('/login', {}, { auth: { username: email, password } })
  }

  // BGSI-276: second step of the login. POST /api/auth/login/2fa { pendingToken, code } -> { token, email, role }
  async verifyTwoFactor(pendingToken, code) {
    return this.post('/login/2fa', { pendingToken, code })
  }

  // POST /api/auth/forgot-password { email } -> 202 always (BGSI-273)
  async forgotPassword(email) {
    return this.post('/forgot-password', { email })
  }

  // POST /api/auth/reset-password { token, newPassword } -> 204, or 400 if the link is not valid
  async resetPassword(token, newPassword) {
    return this.post('/reset-password', { token, newPassword })
  }
}
