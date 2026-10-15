<script setup>
import { computed } from 'vue'
import SkeletonCard from '@/shared/SkeletonCard.vue'
import Pagination from '@/shared/Pagination.vue'
import ProductDetailCard from '@/components/solutions/ProductDetailCard.vue'

const props = defineProps({
  brand: { type: Object, required: true },
  services: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  error: { type: String, default: null },
  // BGSI-248: pagination info (page is 0-based, like the backend)
  page: { type: Number, default: 0 },
  totalPages: { type: Number, default: 1 },
  totalElements: { type: Number, default: 0 },
  pageSize: { type: Number, default: 4 },
})

const emit = defineEmits(['page-change'])

// "Mostrando 1–4 de 6 productos"
const summary = computed(() => {
  const from = props.page * props.pageSize + 1
  const to = from + props.services.length - 1
  return `Mostrando ${from}–${to} de ${props.totalElements} productos`
})
</script>

<template>
  <section class="brand-services" aria-live="polite">
    <h2 class="brand-services__title">Productos de {{ brand.name }}</h2>

    <!-- BGSI-243: grey product sheets while the products load -->
    <div v-if="isLoading" class="brand-services__grid" role="status" aria-busy="true"
         :aria-label="`Cargando productos de ${brand.name}...`">
      <SkeletonCard v-for="n in 2" :key="n" variant="product" />
    </div>

    <p v-else-if="error" class="brand-services__message brand-services__message--error" role="alert">{{ error }}</p>

    <p v-else-if="services.length === 0" class="brand-services__message">
      Esta marca todavía no tiene productos publicados.
    </p>

    <template v-else>
      <div class="brand-services__grid">
        <ProductDetailCard v-for="service in services" :key="service.id" :service="service" />
      </div>

      <!-- BGSI-248: counter + pages, only when there is more than one page -->
      <div v-if="totalPages > 1" class="brand-services__pages">
        <p class="brand-services__summary">{{ summary }}</p>
        <Pagination :current-page="page" :total-pages="totalPages" @change="emit('page-change', $event)" />
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.brand-services {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--color-bg-alt);
  border-radius: var(--radius);
  // When we scroll to the products, leave room for the header + the brand bar (BGSI-247)
  scroll-margin-top: 140px;

  &__title { margin: 0 0 1.5rem; color: var(--color-navy); }
  // BGSI-206: one full product sheet under the other
  &__grid { display: flex; flex-direction: column; gap: 1.5rem; }
  &__message { color: var(--color-muted); }
  &__message--error { color: #b91c1c; }

  &__pages { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; margin-top: 1.75rem; }
  &__summary { margin: 0; font-size: 0.9rem; color: var(--color-muted); }
}

@media (max-width: 560px) {
  .brand-services { padding: 1.25rem; }
}
</style>
