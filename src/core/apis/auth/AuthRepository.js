import BaseRepository from '@/core/apis/base/BaseRepository'

export default class AuthRepository extends BaseRepository {

  constructor() {
    super('/auth')
  }

  // POST /api/auth/login with HTTP Basic (email + password) -> { token, email, role }
  async login(email, password) {
    return this.post('/login', {}, { auth: { username: email, password } })
  }
}
