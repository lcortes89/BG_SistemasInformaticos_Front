import BaseRepository from '@/core/apis/base/BaseRepository'

export default class AuthRepository extends BaseRepository {

  constructor() {
    super('/auth')
  }

  // POST /api/auth/login with HTTP Basic (email + password) -> { token, email, role }
  async login(email, password) {
    return this.post('/login', {}, { auth: { username: email, password } })
  }

  // POST /api/auth/register (only an ADMIN, with its JWT) -> { id, email, role } (BGSI-197)
  async register(email, password) {
    return this.post('/register', { email, password })
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
