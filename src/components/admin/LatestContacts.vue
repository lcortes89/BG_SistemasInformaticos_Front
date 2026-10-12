<script setup>
defineProps({
  contacts: { type: Array, required: true }, // ContactModel[]
})
</script>

<template>
  <p v-if="contacts.length === 0" class="admin-table__empty">Todavía no hay mensajes del formulario de contacto.</p>

  <table v-else class="admin-table">
    <thead>
      <tr>
        <th scope="col">Nombre</th>
        <th scope="col">Email y teléfono</th>
        <th scope="col">Servicio de interés</th>
        <th scope="col">Fecha</th>
        <th scope="col">Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="contact in contacts" :key="contact.id">
        <td data-label="Nombre"><strong>{{ contact.name }}</strong></td>
        <td data-label="Email y teléfono">
          {{ contact.email }}
          <small v-if="contact.phone"><br />{{ contact.phone }}</small>
        </td>
        <td data-label="Servicio de interés">{{ contact.interestedService || '—' }}</td>
        <td data-label="Fecha">{{ contact.getFormattedDate() }}</td>
        <td data-label="Estado">
          <span class="admin-table__badge" :class="contact.status === 'NEW' ? 'latest__badge--new' : 'admin-table__badge--off'">
            {{ contact.getStatusLabel() }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.latest__badge--new { color: #9a3412; background: #ffedd5; }
</style>
