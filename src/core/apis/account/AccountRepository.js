import BaseRepository from '@/core/apis/base/BaseRepository'

// "Mi cuenta": the logged-in admin's own account (BGSI-272)
export default class AccountRepository extends BaseRepository {

  constructor() {
    super('/admin/account')
  }

  // PUT /api/admin/account/password { currentPassword, newPassword } -> { token }
  async changePassword(currentPassword, newPassword) {
    return this.put('/password', { currentPassword, newPassword })
  }

  // BGSI-275: POST /api/admin/account/confirm { password, code } -> { confirmToken, expiresInSeconds }
  // code: only when 2FA is on (BGSI-276)
  async confirmPassword(password, code = null) {
    return this.post('/confirm', code ? { password, code } : { password })
  }

  // BGSI-276: two-step verification
  // GET /2fa -> { enabled, recoveryCodesLeft }
  async getTwoFactor() {
    return this.get('/2fa')
  }

  // POST /2fa/setup -> { secret, otpauthUri }
  async setupTwoFactor() {
    return this.post('/2fa/setup')
  }

  // POST /2fa/enable { code } -> { recoveryCodes }
  async enableTwoFactor(code) {
    return this.post('/2fa/enable', { code })
  }

  // DELETE /2fa -> 204 (needs the password confirmation)
  async disableTwoFactor() {
    return this.delete('/2fa')
  }
}
