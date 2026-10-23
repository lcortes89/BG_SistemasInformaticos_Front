<script setup>
// BGSI-310: same text and colours in Clientes, Marcas and Productos
defineProps({
  active: { type: Boolean, required: true },
})
</script>

<template>
  <span class="admin-table__badge" :class="active ? 'admin-table__badge--on' : 'admin-table__badge--off'">
    {{ active ? 'Activo' : 'Inactivo' }}
  </span>
</template>
