<script setup>
defineProps({
  modelValue: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])

const options = [
  { value: null, label: 'Todos' },
  { value: 'NEW', label: 'Nuevos' },
  { value: 'CONTACTED', label: 'Contactados' },
  { value: 'ARCHIVED', label: 'Archivados' },
]
</script>

<template>
  <div class="status-filter" role="group" aria-label="Filtrar por estado">
    <button
      v-for="option in options"
      :key="option.label"
      type="button"
      class="status-filter__button"
      :class="{ 'status-filter__button--active': option.value === modelValue }"
      :aria-pressed="option.value === modelValue"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.status-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  &__button {
    padding: 0.45rem 1rem;
    font: inherit;
    font-weight: 600;
    color: var(--color-navy);
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 999px;
    cursor: pointer;

    &:hover { border-color: var(--color-orange); }

    &--active {
      color: #fff;
      background: var(--color-navy);
      border-color: var(--color-navy);
    }
  }
}
</style>
