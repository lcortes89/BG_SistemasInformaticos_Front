<script setup>
import RowActionsMenu from '@/shared/RowActionsMenu.vue'

// BGSI-312: the actions of each row, in the "⋯" menu
const ACTIONS = [
  { key: 'edit', label: 'Editar', icon: 'edit' },
  { key: 'delete', label: 'Borrar', icon: 'trash', danger: true },
]

defineProps({
  brands: { type: Array, required: true }, // BrandModel[]
})

const emit = defineEmits(['edit', 'delete'])
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
      <tr v-for="brand in brands" :key="brand.id">
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
          <span class="admin-table__badge" :class="brand.active ? 'admin-table__badge--on' : 'admin-table__badge--off'">
            {{ brand.active ? 'Visible' : 'Oculta' }}
          </span>
        </td>
        <td class="row-actions-cell">
          <RowActionsMenu :items="ACTIONS" :label="`Acciones de ${brand.name}`" @select="emit($event, brand)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
