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
}
