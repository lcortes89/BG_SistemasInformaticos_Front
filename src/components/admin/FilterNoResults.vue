<script setup>
// BGSI-302: the list is empty because of the filters, not because there is nothing yet
defineProps({
  what: { type: String, required: true }, // e.g. 'clientes'
})

defineEmits(['clear'])
</script>

<template>
  <div class="no-results" role="status" data-test="filter-no-results">
    <p>No hay {{ what }} que coincidan con la búsqueda.</p>
    <button type="button" class="no-results__clear" @click="$emit('clear')">Limpiar filtros</button>
  </div>
</template>

<style scoped lang="scss">
.no-results {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
  color: var(--color-muted);
  background: #fff;
  border-radius: var(--radius);

  p { margin: 0; }

  &__clear {
    padding: 0.5rem 1rem;
    font: inherit;
    font-weight: 600;
    color: var(--color-navy);
    background: transparent;
    border: 1px solid #cbd5e1;
    border-radius: var(--radius);
    cursor: pointer;

    &:hover { border-color: var(--color-orange); color: var(--color-orange); }
  }
}
</style>
