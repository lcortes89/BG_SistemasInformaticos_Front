// Backend JSON (ClientDTO / AdminClientDTO) -> model fields, with safe defaults
export const clientMapper = {
  id: (dto) => dto.id,
  name: (dto) => dto.name,
  businessType: (dto) => dto.businessType ?? '',
  testimonial: (dto) => dto.testimonial ?? '',
  logoUrl: (dto) => dto.logoUrl ?? null,
  rating: (dto) => dto.rating ?? 0,
  published: (dto) => dto.published ?? true,

  // Admin form -> body of POST/PUT /api/admin/clients (ClientRequestDTO)
  toRequest: (form) => ({
    name: form.name.trim(),
    businessType: form.businessType.trim(),
    testimonial: form.testimonial.trim(),
    logoUrl: form.logoUrl.trim() || null,
    rating: Number(form.rating),
    published: form.published,
  }),
}
