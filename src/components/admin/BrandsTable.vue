<script setup>
import RowActionsMenu from '@/shared/RowActionsMenu.vue'
import ActiveBadge from '@/shared/ActiveBadge.vue'
import { editToggleDeleteActions } from '@/components/admin/row-actions'

defineProps({
  brands: { type: Array, required: true }, // BrandModel[]
})

// BGSI-312 / 310: the actions of each row, in the "⋯" menu. toggle = Activar / Inactivar
const emit = defineEmits(['edit', 'toggle', 'delete'])
</script>

<template>
  <p v-if="brands.length === 0" class="admin-table__empty">Todavía no hay marcas. Crea la primera.</p>

  <table v-else class="admin-table">
    <thead>
      <tr>
        <th scope="col">Marca</th>
        <th scope="col">Categoría</th>
        <th scope="col">Productos</th>
        <th scope="col">Estado</th>
        <th scope="col" class="row-actions-cell"><span class="sr-only">Acciones</span></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="brand in brands" :key="brand.id" :class="{ 'admin-table__row--inactive': !brand.active }">
        <td data-label="Marca">
          <div class="admin-table__identity">
            <img v-if="brand.logoUrl" :src="brand.logoUrl" alt="" class="admin-table__thumb" />
            <span v-else class="admin-table__initials">{{ brand.getInitials() }}</span>
            <strong>{{ brand.name }}</strong>
          </div>
        </td>
        <td data-label="Categoría">{{ brand.category }}</td>
        <td data-label="Productos">{{ brand.serviceCount }}</td>
        <td data-label="Estado">
          <ActiveBadge :active="brand.active" />
        </td>
        <td class="row-actions-cell">
          <RowActionsMenu :items="editToggleDeleteActions(brand.active)" :label="`Acciones de ${brand.name}`" @select="emit($event, brand)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
