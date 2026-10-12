// Backend JSON (ClientDTO) -> model fields, with safe defaults
export const clientMapper = {
  id: (dto) => dto.id,
  name: (dto) => dto.name,
  businessType: (dto) => dto.businessType ?? '',
  testimonial: (dto) => dto.testimonial ?? '',
  logoUrl: (dto) => dto.logoUrl ?? null,
  rating: (dto) => dto.rating ?? 0,
}
