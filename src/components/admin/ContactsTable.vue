<script setup>
defineProps({
  contacts: { type: Array, required: true }, // ContactModel[]
})

// change-status: (contact, newStatus) · edit-note: (contact)
const emit = defineEmits(['change-status', 'edit-note'])
</script>

<template>
  <p v-if="contacts.length === 0" class="contacts-table__empty">
    No hay contactos con este estado.
  </p>

  <table v-else class="contacts-table">
    <thead>
      <tr>
        <th scope="col">Fecha</th>
        <th scope="col">Nombre</th>
        <th scope="col">Contacto</th>
        <th scope="col">Servicio</th>
        <th scope="col">Mensaje</th>
        <th scope="col">Estado</th>
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="contact in contacts" :key="contact.id">
        <td data-label="Fecha">{{ contact.getFormattedDate() }}</td>
        <td data-label="Nombre" class="contacts-table__name">{{ contact.name }}</td>
        <td data-label="Contacto">
          <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
          <span v-if="contact.phone" class="contacts-table__phone">{{ contact.phone }}</span>
        </td>
        <td data-label="Servicio">{{ contact.interestedService || '—' }}</td>
        <td data-label="Mensaje" class="contacts-table__message">
          {{ contact.message }}
          <span v-if="contact.note" class="contacts-table__note">Nota: {{ contact.note }}</span>
        </td>
        <td data-label="Estado">
          <span class="contacts-table__status" :class="`contacts-table__status--${contact.status.toLowerCase()}`">
            {{ contact.getStatusLabel() }}
          </span>
        </td>
        <td data-label="Acciones">
          <div class="contacts-table__actions">
            <button v-if="contact.status === 'NEW'" type="button" class="contacts-table__action"
                    @click="emit('change-status', contact, 'CONTACTED')">
              Marcar contactado
            </button>
            <button type="button" class="contacts-table__action" @click="emit('edit-note', contact)">
              {{ contact.note ? 'Editar nota' : 'Añadir nota' }}
            </button>
            <button v-if="contact.status !== 'ARCHIVED'" type="button"
                    class="contacts-table__action contacts-table__action--danger"
                    @click="emit('change-status', contact, 'ARCHIVED')">
              Archivar
            </button>
            <button v-else type="button" class="contacts-table__action"
                    @click="emit('change-status', contact, 'NEW')">
              Restaurar
            </button>
          </div>
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
  overflow: hidden;
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

  a { color: var(--color-navy); }

  &__name { font-weight: 600; color: var(--color-navy); }
  &__phone { display: block; color: var(--color-muted); font-size: 0.9rem; }
  &__message { max-width: 320px; color: var(--color-text); }

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

    &--new { color: #9a3412; background: #ffedd5; }
    &--contacted { color: #14532d; background: #dcfce7; }
    &--archived { color: #374151; background: #e5e7eb; }
  }

  &__actions { display: flex; flex-direction: column; align-items: flex-start; gap: 0.35rem; }

  &__action {
    padding: 0;
    font: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-navy);
    background: none;
    border: 0;
    text-decoration: underline;
    cursor: pointer;

    &:hover { color: var(--color-orange-dark); }
    &--danger { color: #b91c1c; }
  }

  &__empty {
    padding: 2rem;
    text-align: center;
    color: var(--color-muted);
    background: #fff;
    border-radius: var(--radius);
  }
}

/* Mobile: each row becomes a card */
@media (max-width: 768px) {
  .contacts-table {
    background: transparent;
    box-shadow: none;

    thead { display: none; }

    tr {
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

    &__message { max-width: none; }
    &__actions { flex-direction: row; flex-wrap: wrap; gap: 1rem; }
  }
}
</style>
