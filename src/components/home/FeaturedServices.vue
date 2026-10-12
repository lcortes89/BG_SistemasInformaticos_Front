<script setup>
import { RouterLink } from 'vue-router'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import ServiceCard from '@/shared/ServiceCard.vue'

defineProps({
  services: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  error: { type: String, default: null },
})
</script>

<template>
  <section class="featured">
    <div class="container">
      <h2 class="featured__title">Resumen de servicios</h2>

      <LoadingSpinner v-if="isLoading" label="Cargando servicios..." />

      <p v-else-if="error" class="featured__message featured__message--error" role="alert">{{ error }}</p>

      <p v-else-if="services.length === 0" class="featured__message">
        Muy pronto mostraremos aquí nuestros servicios destacados.
      </p>

      <template v-else>
        <div class="featured__grid">
          <ServiceCard v-for="service in services" :key="service.id" :service="service" />
        </div>
        <div class="featured__more">
          <RouterLink to="/soluciones" class="btn btn--primary">Ver todas las soluciones</RouterLink>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.featured {
  padding: 4rem 0;
  background: var(--color-bg-alt);

  &__title { margin: 0 0 2rem; text-align: center; color: var(--color-navy); }
  &__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  &__more { margin-top: 2rem; text-align: center; }
  &__message { text-align: center; color: var(--color-muted); }
  &__message--error { color: #b91c1c; }
}

@media (max-width: 900px) {
  .featured__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .featured__grid { grid-template-columns: 1fr; }
}
</style>
