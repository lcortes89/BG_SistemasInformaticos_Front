<script setup>
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
        <th scope="col">Acciones</th>
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
        <td data-label="Acciones">
          <div class="admin-table__actions">
            <button type="button" class="admin-table__action" @click="emit('edit', brand)">Editar</button>
            <button type="button" class="admin-table__action admin-table__action--danger" @click="emit('delete', brand)">
              Borrar
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
