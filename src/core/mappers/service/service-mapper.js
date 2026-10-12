// Backend JSON (ServiceDTO / AdminServiceDTO) -> model fields, with safe defaults
export const serviceMapper = {
  id: (dto) => dto.id,
  name: (dto) => dto.name,
  description: (dto) => dto.description ?? '',
  imageUrl: (dto) => dto.imageUrl ?? null,
  brandId: (dto) => dto.brandId ?? null,
  brandName: (dto) => dto.brandName ?? '',
  featured: (dto) => dto.featured ?? false,

  // Admin form -> body of POST/PUT /api/admin/services (ServiceRequestDTO)
  toRequest: (form) => ({
    name: form.name.trim(),
    description: form.description.trim() || null,
    imageUrl: form.imageUrl.trim() || null,
    featured: form.featured,
    brandId: Number(form.brandId),
  }),
}
