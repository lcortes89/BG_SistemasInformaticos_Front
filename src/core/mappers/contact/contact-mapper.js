export const contactMapper = {
  // Form -> body of POST /api/contacts (ContactRequestDTO)
  toRequest: (form) => ({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || null,
    interestedService: form.interestedService || null,
    message: form.message.trim(),
    gdprConsent: form.gdprConsent,
  }),

  // Response (ContactResponseDTO) -> model fields
  id: (dto) => dto.id,
  name: (dto) => dto.name,
  status: (dto) => dto.status,
  createdAt: (dto) => dto.createdAt,
  email: (dto) => dto.email ?? null,
  phone: (dto) => dto.phone ?? null,
  interestedService: (dto) => dto.interestedService ?? null,
  message: (dto) => dto.message ?? null,
  note: (dto) => dto.note ?? null,
}
