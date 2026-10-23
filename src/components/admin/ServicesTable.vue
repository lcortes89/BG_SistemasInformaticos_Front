<script setup>
import ExpandableText from '@/shared/ExpandableText.vue'
import RowActionsMenu from '@/shared/RowActionsMenu.vue'

// BGSI-312: the actions of each row, in the "⋯" menu
const ACTIONS = [
  { key: 'edit', label: 'Editar', icon: 'edit' },
  { key: 'delete', label: 'Borrar', icon: 'trash', danger: true },
]

defineProps({
  services: { type: Array, required: true }, // ServiceModel[]
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <p v-if="services.length === 0" class="admin-table__empty">No hay productos para este filtro.</p>

  <table v-else class="admin-table">
    <thead>
      <tr>
        <th scope="col">Producto</th>
        <th scope="col">Marca</th>
        <th scope="col">Descripción</th>
        <th scope="col">Inicio</th>
        <th scope="col" class="row-actions-cell"><span class="sr-only">Acciones</span></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="service in services" :key="service.id">
        <td data-label="Producto">
          <div class="admin-table__identity">
            <img v-if="service.imageUrl" :src="service.imageUrl" alt="" class="admin-table__thumb" />
            <strong>{{ service.name }}</strong>
          </div>
        </td>
        <td data-label="Marca">{{ service.brandName }}</td>
        <td data-label="Descripción" class="admin-table__text">
          <ExpandableText v-if="service.description" :text="service.description" />
          <span v-else>—</span>
        </td>
        <td data-label="Inicio">
          <span v-if="service.featured" class="admin-table__badge admin-table__badge--on">Destacado</span>
          <span v-else>—</span>
        </td>
        <td class="row-actions-cell">
          <RowActionsMenu :items="ACTIONS" :label="`Acciones de ${service.name}`" @select="emit($event, service)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
