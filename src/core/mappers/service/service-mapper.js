// Backend JSON (ServiceDTO) -> model fields, with safe defaults
export const serviceMapper = {
  id: (dto) => dto.id,
  name: (dto) => dto.name,
  description: (dto) => dto.description ?? '',
  imageUrl: (dto) => dto.imageUrl ?? null,
  brandId: (dto) => dto.brandId ?? null,
  brandName: (dto) => dto.brandName ?? '',
}
