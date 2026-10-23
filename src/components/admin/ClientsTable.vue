<script setup>
import StarRating from '@/shared/StarRating.vue'
import ExpandableText from '@/shared/ExpandableText.vue'
import RowActionsMenu from '@/shared/RowActionsMenu.vue'
import ActiveBadge from '@/shared/ActiveBadge.vue'
import { editToggleDeleteActions } from '@/components/admin/row-actions'

defineProps({
  clients: { type: Array, required: true }, // ClientModel[]
})

// BGSI-312 / 310: the actions of each row, in the "⋯" menu. toggle = Activar / Inactivar
const emit = defineEmits(['edit', 'toggle', 'delete'])
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
        <th scope="col" class="row-actions-cell"><span class="sr-only">Acciones</span></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in clients" :key="client.id" :class="{ 'admin-table__row--inactive': !client.published }">
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
        <td data-label="Testimonio" class="admin-table__text"><ExpandableText :text="`“${client.testimonial}”`" /></td>
        <td data-label="Estado">
          <ActiveBadge :active="client.published" />
        </td>
        <td class="row-actions-cell">
          <RowActionsMenu :items="editToggleDeleteActions(client.published)" :label="`Acciones de ${client.name}`" @select="emit($event, client)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
