<script setup>
defineProps({
  label: { type: String, default: 'Cargando...' },
})
</script>

<template>
  <div class="spinner" role="status" :aria-label="label">
    <span class="spinner__circle"></span>
    <span class="spinner__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.spinner { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2rem; color: var(--color-muted); }
.spinner__circle {
  width: 40px; height: 40px;
  border: 4px solid var(--color-bg-alt);
  border-top-color: var(--color-orange);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
