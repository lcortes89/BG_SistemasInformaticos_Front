// The logged-in admin: the JWT plus who it belongs to
export default class SessionModel {

  constructor(token, email, role) {
    this.token = token
    this.email = email
    this.role = role
  }

  static create(dto, mapper) {
    return new SessionModel(mapper.token(dto), mapper.email(dto), mapper.role(dto))
  }

  isAdmin() {
    return this.role === 'ADMIN'
  }

  // The JWT carries its expiry date ("exp", in seconds) inside its middle part
  isExpired(now = Date.now()) {
    try {
      const payload = this.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const { exp } = JSON.parse(atob(payload))
      return !exp || exp * 1000 <= now
    } catch {
      return true // a token we cannot read is treated as expired
    }
  }
}
