// Backend JSON (BrandDTO / AdminBrandDTO) -> model fields, with safe defaults
export const brandMapper = {
  id: (dto) => dto.id,
  name: (dto) => dto.name,
  description: (dto) => dto.description ?? '',
  category: (dto) => dto.category ?? '',
  logoUrl: (dto) => dto.logoUrl ?? null,
  active: (dto) => dto.active ?? true,
  serviceCount: (dto) => dto.serviceCount ?? 0,

  // Admin form -> body of POST/PUT /api/admin/brands (BrandRequestDTO)
  toRequest: (form) => ({
    name: form.name.trim(),
    description: form.description.trim() || null,
    category: form.category.trim(),
    logoUrl: form.logoUrl.trim() || null,
    active: form.active,
  }),
}
