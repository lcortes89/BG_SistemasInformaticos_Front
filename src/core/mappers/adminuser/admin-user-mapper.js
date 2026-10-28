// Backend JSON (AdminUserDTO) -> model fields, with safe defaults (BGSI-277)
export const adminUserMapper = {
  id: (dto) => dto.id,
  email: (dto) => dto.email,
  status: (dto) => dto.status ?? 'ACTIVE',
  twoFactorEnabled: (dto) => dto.twoFactorEnabled ?? false,
  lastLoginAt: (dto) => dto.lastLoginAt ?? null,
  you: (dto) => dto.you ?? false,
}
