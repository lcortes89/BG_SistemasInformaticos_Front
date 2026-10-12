// Backend JSON (BrandDTO) -> model fields, with safe defaults
export const brandMapper = {
  id: (dto) => dto.id,
  name: (dto) => dto.name,
  description: (dto) => dto.description ?? '',
  category: (dto) => dto.category ?? '',
  logoUrl: (dto) => dto.logoUrl ?? null,
}
