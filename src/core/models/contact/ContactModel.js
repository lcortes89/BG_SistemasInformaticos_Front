const STATUS_LABELS = {
  NEW: 'Nuevo',
  CONTACTED: 'Contactado',
  ARCHIVED: 'Archivado',
}

// A message sent from the contact form (ContactResponseDTO)
export default class ContactModel {

  constructor(id, name, status, createdAt, email = null, phone = null,
              interestedService = null, message = null, note = null) {
    this.id = id
    this.name = name
    this.status = status
    this.createdAt = createdAt
    this.email = email
    this.phone = phone
    this.interestedService = interestedService
    this.message = message
    this.note = note
  }

  static create(dto, mapper) {
    return new ContactModel(
      mapper.id(dto), mapper.name(dto), mapper.status(dto), mapper.createdAt(dto),
      mapper.email(dto), mapper.phone(dto), mapper.interestedService(dto),
      mapper.message(dto), mapper.note(dto),
    )
  }

  getStatusLabel() {
    return STATUS_LABELS[this.status] || this.status
  }

  // "2026-10-12T15:30:00" -> "12/10/2026, 15:30"
  getFormattedDate() {
    if (!this.createdAt) return ''
    return new Date(this.createdAt).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }
}
