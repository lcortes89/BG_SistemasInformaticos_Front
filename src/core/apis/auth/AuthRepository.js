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
}
