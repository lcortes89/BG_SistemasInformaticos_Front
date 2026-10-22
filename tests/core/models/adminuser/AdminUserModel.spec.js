import { describe, it, expect } from 'vitest'
import AdminUserModel from '@/core/models/adminuser/AdminUserModel'
import { adminUserMapper } from '@/core/mappers/adminuser/admin-user-mapper'

const admin = (dto) => AdminUserModel.create({ id: 1, email: 'maria.lopez@bg.es', ...dto }, adminUserMapper)

// BGSI-277
describe('AdminUserModel', () => {
  it('uses safe defaults for the missing fields', () => {
    const model = AdminUserModel.create({ id: 1, email: 'a@bg.es' }, adminUserMapper)

    expect(model.status).toBe('ACTIVE')
    expect(model.twoFactorEnabled).toBe(false)
    expect(model.lastLoginAt).toBeNull()
    expect(model.you).toBe(false)
  })

  it('says the status in Spanish', () => {
    expect(admin({ status: 'ACTIVE' }).getStatusLabel()).toBe('Activo')
    expect(admin({ status: 'PENDING' }).getStatusLabel()).toBe('Pendiente')
    expect(admin({ status: 'BLOCKED' }).getStatusLabel()).toBe('Bloqueado')
    expect(admin({ status: 'BLOCKED' }).isBlocked()).toBe(true)
    expect(admin({ status: 'PENDING' }).isPending()).toBe(true)
    expect(admin({ status: 'ACTIVE' }).isActive()).toBe(true)
  })

  it('takes two letters of the email as initials, without numbers', () => {
    expect(admin({ email: 'maria.lopez@bg.es' }).getInitials()).toBe('ML')
    expect(admin({ email: 'luisa-1609@hotmail.com' }).getInitials()).toBe('LU')
    expect(admin({ email: 'pedro@bg.es' }).getInitials()).toBe('PE')
  })

  it('shows "Nunca" when the admin never logged in, and the date otherwise', () => {
    expect(admin({ lastLoginAt: null }).getLastLogin()).toBe('Nunca')
    expect(admin({ lastLoginAt: '2026-10-21T08:30:00Z' }).getLastLogin()).toMatch(/^21\/10\/2026 \d{2}:30$/)
  })
})
