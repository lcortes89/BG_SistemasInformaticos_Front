import AuthRepository from '@/core/apis/auth/AuthRepository'
import SessionModel from '@/core/models/auth/SessionModel'
import { authMapper } from '@/core/mappers/auth/auth-mapper'

export default class AuthService {

  #repo

  constructor(repository = new AuthRepository()) {
    this.#repo = repository
  }

  async login(email, password) {
    const dto = await this.#repo.login(email.trim(), password)
    return SessionModel.create(dto, authMapper)
  }

  // Creates another administrator and returns the email that was registered (BGSI-197)
  async registerAdmin(email, password) {
    const dto = await this.#repo.register(email.trim(), password)
    return dto.email
  }
}
