// BGSI-297: the menu of the admin panel, grouped by what the admin wants to do.
// "Resumen" is a direct link above the groups: it is the first page after the login
export const ADMIN_HOME = { to: { name: 'admin-dashboard' }, label: 'Resumen', icon: '🏠' }

export const ADMIN_MENU = [
  {
    title: 'Gestión de clientes',
    icon: '👥',
    links: [
      { to: { name: 'admin-contacts' }, label: 'Contactos' },
      { to: { name: 'admin-clients' }, label: 'Clientes' },
    ],
  },
  {
    title: 'Gestión comercial',
    icon: '💼',
    links: [
      { to: { name: 'admin-brands' }, label: 'Marcas' },
      { to: { name: 'admin-services' }, label: 'Productos' },
      { to: { name: 'admin-rates' }, label: 'Tarifas' },
    ],
  },
  {
    title: 'Gestión Administración',
    icon: '🛡️',
    links: [
      { to: { name: 'admin-users' }, label: 'Administradores' },
      { to: { name: 'admin-mail-settings' }, label: 'Avisos por correo' },
      { to: { name: 'admin-settings' }, label: 'Foto de portada' },
    ],
  },
  {
    title: 'Ajustes de perfil',
    icon: '👤',
    // BGSI-314: one page for each setting
    links: [
      { to: { name: 'admin-change-password' }, label: 'Cambiar contraseña' },
      { to: { name: 'admin-change-email' }, label: 'Cambiar email' },
      { to: { name: 'admin-two-factor' }, label: 'Verificación en dos pasos' },
    ],
  },
]

// The title of the group that has this page (route name), or null
export function groupOf(routeName) {
  return ADMIN_MENU.find((group) => group.links.some((link) => link.to.name === routeName))?.title ?? null
}
