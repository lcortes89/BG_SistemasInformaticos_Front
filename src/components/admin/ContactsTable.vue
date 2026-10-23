<script setup>
import ExpandableText from '@/shared/ExpandableText.vue'
import RowActionsMenu from '@/shared/RowActionsMenu.vue'

defineProps({
  contacts: { type: Array, required: true }, // ContactModel[]
})

// change-status: (contact, newStatus) · edit-note: (contact) · delete: (contact) (BGSI-308)
const emit = defineEmits(['change-status', 'edit-note', 'delete'])

// BGSI-312: the actions of each row, in the "⋯" menu
function actionsFor(contact) {
  const items = []
  if (contact.status === 'NEW') items.push({ key: 'contacted', label: 'Marcar contactado', icon: 'check' })
  items.push({ key: 'note', label: contact.note ? 'Editar nota' : 'Añadir nota', icon: 'note' })
  if (contact.status === 'ARCHIVED') items.push({ key: 'restore', label: 'Restaurar', icon: 'restore' })
  else items.push({ key: 'archive', label: 'Archivar', icon: 'archive' })
  items.push({ key: 'delete', label: 'Borrar', icon: 'trash', danger: true })
  return items
}

function onAction(contact, key) {
  if (key === 'contacted') emit('change-status', contact, 'CONTACTED')
  else if (key === 'archive') emit('change-status', contact, 'ARCHIVED')
  else if (key === 'restore') emit('change-status', contact, 'NEW')
  else if (key === 'note') emit('edit-note', contact)
  else if (key === 'delete') emit('delete', contact)
}
</script>

<template>
  <p v-if="contacts.length === 0" class="contacts-table__empty">
    No hay contactos con este estado.
  </p>

  <table v-else class="contacts-table">
    <thead>
      <tr>
        <th scope="col">Fecha</th>
        <th scope="col">Contacto</th>
        <th scope="col">Servicio</th>
        <th scope="col">Mensaje</th>
        <th scope="col">Estado</th>
        <th scope="col" class="row-actions-cell"><span class="sr-only">Acciones</span></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="contact in contacts" :key="contact.id">
        <td data-label="Fecha" class="contacts-table__date">{{ contact.getFormattedDate() }}</td>
        <!-- BGSI-312: name, email and phone in one column, so the table fits without scrolling -->
        <td data-label="Contacto" class="contacts-table__who">
          <span class="contacts-table__name">{{ contact.name }}</span>
          <!-- <wbr>: a long email breaks before the @, not in the middle of a word -->
          <a :href="`mailto:${contact.email}`">{{ contact.email.split('@')[0] }}<wbr>@{{ contact.email.split('@')[1] }}</a>
          <span v-if="contact.phone" class="contacts-table__phone">{{ contact.phone }}</span>
        </td>
        <td data-label="Servicio">{{ contact.interestedService || '—' }}</td>
        <td data-label="Mensaje" class="contacts-table__message">
          <ExpandableText :text="contact.message" />
          <span v-if="contact.note" class="contacts-table__note">Nota: {{ contact.note }}</span>
        </td>
        <td data-label="Estado">
          <span class="contacts-table__status" :class="`contacts-table__status--${contact.status.toLowerCase()}`">
            {{ contact.getStatusLabel() }}
          </span>
        </td>
        <td class="row-actions-cell">
          <RowActionsMenu :items="actionsFor(contact)" :label="`Acciones de ${contact.name}`"
                          @select="onAction(contact, $event)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.contacts-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 2px 10px rgba(11, 31, 58, 0.06);

  th, td {
    padding: 0.85rem 1rem;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid #eef0f3;
  }

  th {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--color-muted);
    background: var(--color-bg-alt);
  }

  // The corners of the header, now that the table does not cut its content (the menu goes over it)
  th:first-child { border-top-left-radius: var(--radius); }
  th:last-child { border-top-right-radius: var(--radius); }
  tbody tr:last-child td { border-bottom: 0; }

  a { color: var(--color-navy); }

  &__date { min-width: 6.5rem; }
  &__who { overflow-wrap: break-word; }
  &__name { display: block; font-weight: 600; color: var(--color-navy); }
  &__phone { display: block; color: var(--color-muted); font-size: 0.9rem; }
  &__message { width: 30%; min-width: 180px; color: var(--color-text); }

  &__note {
    display: block;
    margin-top: 0.4rem;
    padding: 0.35rem 0.6rem;
    font-size: 0.85rem;
    color: #78350f;
    background: #fef3c7;
    border-radius: 6px;
  }

  &__status {
    display: inline-block;
    padding: 0.2rem 0.65rem;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 999px;
    white-space: nowrap;

    &--new { color: #9a3412; background: #ffedd5; }
    &--contacted { color: #14532d; background: #dcfce7; }
    &--archived { color: #374151; background: #e5e7eb; }
  }

  &__empty {
    padding: 2rem;
    text-align: center;
    color: var(--color-muted);
    background: #fff;
    border-radius: var(--radius);
  }
}

/* Mobile and narrow screens (the menu takes 320px, this table has more columns): each row becomes a card, with the "⋯" in the top right corner */
@media (max-width: 1200px) {
  .contacts-table {
    background: transparent;
    box-shadow: none;

    thead { display: none; }

    tr {
      position: relative;
      display: block;
      margin-bottom: 1rem;
      padding: 0.5rem 0;
      background: #fff;
      border-radius: var(--radius);
      box-shadow: 0 2px 10px rgba(11, 31, 58, 0.06);
    }

    td {
      display: block;
      padding: 0.4rem 1rem;
      border: 0;

      &::before {
        content: attr(data-label);
        display: block;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--color-muted);
      }
    }

    td:first-child { padding-right: 3.75rem; }
    td.row-actions-cell { position: absolute; top: 0.5rem; right: 0.5rem; width: auto; padding: 0; }
    td.row-actions-cell::before { display: none; }
    &__message { width: auto; min-width: 0; }
  }
}
</style>
