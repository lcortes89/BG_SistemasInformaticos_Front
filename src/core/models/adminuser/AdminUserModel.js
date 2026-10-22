const STATUS_LABELS = {
  ACTIVE: 'Activo',
  PENDING: 'Pendiente',
  BLOCKED: 'Bloqueado',
}

// One row of "Administradores" (AdminUserDTO, BGSI-277)
export default class AdminUserModel {

  constructor(id, email, status, twoFactorEnabled = false, lastLoginAt = null, you = false) {
    this.id = id
    this.email = email
    this.status = status
    this.twoFactorEnabled = twoFactorEnabled
    this.lastLoginAt = lastLoginAt
    this.you = you // the logged-in admin: no actions on yourself here (that is "Mi cuenta")
  }

  static create(dto, mapper) {
    return new AdminUserModel(
      mapper.id(dto), mapper.email(dto), mapper.status(dto),
      mapper.twoFactorEnabled(dto), mapper.lastLoginAt(dto), mapper.you(dto),
    )
  }

  isActive() { return this.status === 'ACTIVE' }
  isPending() { return this.status === 'PENDING' }
  isBlocked() { return this.status === 'BLOCKED' }

  getStatusLabel() {
    return STATUS_LABELS[this.status] || this.status
  }

  // Two letters from the email: "maria.lopez@bg.es" -> "ML", "luisa-1609@bg.es" -> "LU"
  getInitials() {
    const parts = this.email.split('@')[0].split(/[^A-Za-z]+/).filter(Boolean)
    if (parts.length === 0) return this.email.slice(0, 2).toUpperCase()
    const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2)
    return letters.toUpperCase()
  }

  // "2026-10-21T08:30:00Z" -> "21/10/2026 10:30" (local time). Never logged in -> "Nunca"
  getLastLogin() {
    if (!this.lastLoginAt) return 'Nunca'
    return new Date(this.lastLoginAt).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).replace(',', '')
  }
}
