import BaseRepository from '@/core/apis/base/BaseRepository'

// "Administradores" (BGSI-277). The changes need the password (BGSI-275): the interceptor asks for it
export default class AdminUserRepository extends BaseRepository {

  constructor() {
    super('/admin/users')
  }

  // GET /api/admin/users -> AdminUserDTO[]
  async findAll() {
    return this.get('')
  }

  // POST /api/admin/users/invitations { email } -> 201 AdminUserDTO (409 if the email exists)
  async invite(email) {
    return this.post('/invitations', { email })
  }

  // POST /api/admin/users/{id}/invitation -> 204 (a new link for a pending admin)
  async resendInvitation(id) {
    return this.post(`/${id}/invitation`)
  }

  async block(id) {
    return this.put(`/${id}/block`)
  }

  async unblock(id) {
    return this.put(`/${id}/unblock`)
  }

  // DELETE /api/admin/users/{id}/2fa -> AdminUserDTO
  async resetTwoFactor(id) {
    return this.delete(`/${id}/2fa`)
  }

  async remove(id) {
    return this.delete(`/${id}`)
  }
}
