<script setup>
import StarRating from '@/shared/StarRating.vue'

defineProps({
  clients: { type: Array, required: true }, // ClientModel[]
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <p v-if="clients.length === 0" class="admin-table__empty">Todavía no hay clientes. Añade el primer caso de éxito.</p>

  <table v-else class="admin-table">
    <thead>
      <tr>
        <th scope="col">Cliente</th>
        <th scope="col">Valoración</th>
        <th scope="col">Testimonio</th>
        <th scope="col">Estado</th>
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in clients" :key="client.id">
        <td data-label="Cliente">
          <div class="admin-table__identity">
            <img v-if="client.logoUrl" :src="client.logoUrl" alt="" class="admin-table__thumb" />
            <span v-else class="admin-table__initials">{{ client.getInitials() }}</span>
            <span>
              <strong>{{ client.name }}</strong><br />
              <small>{{ client.businessType }}</small>
            </span>
          </div>
        </td>
        <td data-label="Valoración"><StarRating :rating="client.rating" /></td>
        <td data-label="Testimonio" class="admin-table__text">“{{ client.testimonial }}”</td>
        <td data-label="Estado">
          <span class="admin-table__badge" :class="client.published ? 'admin-table__badge--on' : 'admin-table__badge--off'">
            {{ client.published ? 'Publicado' : 'Oculto' }}
          </span>
        </td>
        <td data-label="Acciones">
          <div class="admin-table__actions">
            <button type="button" class="admin-table__action" @click="emit('edit', client)">Editar</button>
            <button type="button" class="admin-table__action admin-table__action--danger" @click="emit('delete', client)">
              Borrar
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
