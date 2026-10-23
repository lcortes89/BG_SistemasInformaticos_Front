// BGSI-310: actions of the "⋯" menu for the rows that can be shown or hidden on the website.
// "Inactivar" when the row is active, "Activar" when it is not
export function editToggleDeleteActions(active) {
  return [
    { key: 'edit', label: 'Editar', icon: 'edit' },
    active
      ? { key: 'toggle', label: 'Inactivar', icon: 'eye-off' }
      : { key: 'toggle', label: 'Activar', icon: 'eye' },
    { key: 'delete', label: 'Borrar', icon: 'trash', danger: true },
  ]
}
