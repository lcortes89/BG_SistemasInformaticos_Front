// "Una por línea" textarea -> list of texts (empty lines dropped) (BGSI-205)
export const linesToList = (text = '') => text.split('\n').map((line) => line.trim()).filter(Boolean)

// Backend JSON (ServiceDTO / AdminServiceDTO) -> model fields, with safe defaults
export const serviceMapper = {
  id: (dto) => dto.id,
  name: (dto) => dto.name,
  description: (dto) => dto.description ?? '',
  imageUrl: (dto) => dto.imageUrl ?? null,
  brandId: (dto) => dto.brandId ?? null,
  brandName: (dto) => dto.brandName ?? '',
  featured: (dto) => dto.featured ?? false,
  longDescription: (dto) => dto.longDescription ?? '',
  features: (dto) => dto.features ?? [],
  sectors: (dto) => dto.sectors ?? [],

  // Admin form -> body of POST/PUT /api/admin/services (ServiceRequestDTO)
  toRequest: (form) => ({
    name: form.name.trim(),
    description: form.description.trim() || null,
    imageUrl: form.imageUrl.trim() || null,
    featured: form.featured,
    brandId: Number(form.brandId),
    longDescription: (form.longDescription ?? '').trim() || null,
    features: linesToList(form.featuresText),
    sectors: linesToList(form.sectorsText),
  }),
}
