// BGSI-302: the options of the "Estado" filter of each admin list. The first one (null) = all
export const ACTIVE_OPTIONS = [
  { value: null, label: 'Todos los estados' },
  { value: true, label: 'Activos' },
  { value: false, label: 'Inactivos' },
]

export const CONTACT_STATUS_OPTIONS = [
  { value: null, label: 'Todos los estados' },
  { value: 'NEW', label: 'Nuevos' },
  { value: 'CONTACTED', label: 'Contactados' },
  { value: 'ARCHIVED', label: 'Archivados' },
]

export const ADMIN_STATUS_OPTIONS = [
  { value: null, label: 'Todos los estados' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'BLOCKED', label: 'Bloqueados' },
]
