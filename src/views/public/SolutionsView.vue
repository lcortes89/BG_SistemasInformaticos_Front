<script setup>
import { onMounted } from 'vue'
import PageHero from '@/shared/PageHero.vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import BrandCard from '@/components/solutions/BrandCard.vue'
import BrandServices from '@/components/solutions/BrandServices.vue'
import { useSolutions } from '@/composables/solutions/useSolutions'

const {
  brands, isLoadingBrands, brandsError, loadBrands,
  selectedBrand, services, isLoadingServices, servicesError, selectBrand,
} = useSolutions()

onMounted(loadBrands)
</script>

<template>
  <PageHero
    title="Nuestras Soluciones"
    subtitle="Distribuidores oficiales de la tecnología líder para digitalizar hostelería y comercio: gestión de efectivo, software TPV, ERP y robótica de servicio."
    centered
  />

  <section class="solutions">
    <div class="container">
      <LoadingSpinner v-if="isLoadingBrands" label="Cargando marcas..." />

      <p v-else-if="brandsError" class="solutions__message solutions__message--error" role="alert">{{ brandsError }}</p>

      <p v-else-if="brands.length === 0" class="solutions__message">
        No hay soluciones disponibles en este momento.
      </p>

      <template v-else>
        <p class="solutions__hint">Elige una marca para ver sus productos.</p>

        <div class="solutions__grid">
          <BrandCard
            v-for="brand in brands"
            :key="brand.id"
            :brand="brand"
            :active="selectedBrand?.id === brand.id"
            @select="selectBrand"
          />
        </div>

        <Transition name="slide-fade" mode="out-in">
          <BrandServices
            v-if="selectedBrand"
            :key="selectedBrand.id"
            :brand="selectedBrand"
            :services="services"
            :is-loading="isLoadingServices"
            :error="servicesError"
          />
        </Transition>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.solutions {
  padding: 3rem 0 4rem;

  &__hint { margin: 0 0 1.5rem; text-align: center; color: var(--color-muted); }
  &__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
  &__message { text-align: center; color: var(--color-muted); }
  &__message--error { color: #b91c1c; }
}

@media (max-width: 1024px) {
  .solutions__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .solutions__grid { grid-template-columns: 1fr; }
}
</style>
