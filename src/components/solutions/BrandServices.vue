<script setup>
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import ProductDetailCard from '@/components/solutions/ProductDetailCard.vue'

defineProps({
  brand: { type: Object, required: true },
  services: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  error: { type: String, default: null },
})
</script>

<template>
  <section class="brand-services" aria-live="polite">
    <h2 class="brand-services__title">Productos de {{ brand.name }}</h2>

    <LoadingSpinner v-if="isLoading" :label="`Cargando productos de ${brand.name}...`" />

    <p v-else-if="error" class="brand-services__message brand-services__message--error" role="alert">{{ error }}</p>

    <p v-else-if="services.length === 0" class="brand-services__message">
      Esta marca todavía no tiene productos publicados.
    </p>

    <div v-else class="brand-services__grid">
      <ProductDetailCard v-for="service in services" :key="service.id" :service="service" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.brand-services {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--color-bg-alt);
  border-radius: var(--radius);

  &__title { margin: 0 0 1.5rem; color: var(--color-navy); }
  // BGSI-206: one full product sheet under the other
  &__grid { display: flex; flex-direction: column; gap: 1.5rem; }
  &__message { color: var(--color-muted); }
  &__message--error { color: #b91c1c; }
}

@media (max-width: 560px) {
  .brand-services { padding: 1.25rem; }
}
</style>
