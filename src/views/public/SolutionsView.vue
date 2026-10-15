<script setup>
import { nextTick, onMounted, ref } from 'vue'
import PageHero from '@/shared/PageHero.vue'
import PageBackdrop from '@/shared/PageBackdrop.vue'
import SkeletonCard from '@/shared/SkeletonCard.vue'
import BrandCard from '@/components/solutions/BrandCard.vue'
import BrandServices from '@/components/solutions/BrandServices.vue'
import BrandStickyBar from '@/components/solutions/BrandStickyBar.vue'
import { useSolutions } from '@/composables/solutions/useSolutions'
import { useElementPassed } from '@/composables/layout/useElementPassed'

const {
  brands, isLoadingBrands, brandsError, loadBrands,
  selectedBrand, services, isLoadingServices, servicesError, selectBrand,
  servicesPage, servicesTotalPages, servicesTotal, pageSize, loadServicesPage,
} = useSolutions()

// BGSI-247: the brand bar appears once the brand cards have gone up, out of the screen
const brandGrid = ref(null)
const { isPassed: isBrandGridPassed } = useElementPassed(brandGrid, 72)

const productsSection = ref(null)

// Scroll up only to the title of the products, not to the top of the page
async function scrollToProducts() {
  await nextTick()
  const element = productsSection.value?.$el ?? productsSection.value
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function changeBrandFromBar(brand) {
  await selectBrand(brand)
  scrollToProducts()
}

async function changePage(pageIndex) {
  await loadServicesPage(pageIndex)
  scrollToProducts()
}

function showAllBrands() {
  brandGrid.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

onMounted(loadBrands)
</script>

<template>
  <PageBackdrop>
    <PageHero
      transparent
      eyebrow="Distribuidores oficiales"
      title="Nuestras Soluciones"
      subtitle="Tecnología líder para digitalizar hostelería y comercio: gestión de efectivo, software TPV, ERP y robótica de servicio."
    />

    <section class="solutions">
      <div class="container">
        <!-- BGSI-243: grey cards while the brands load -->
        <div v-if="isLoadingBrands" class="solutions__grid" role="status" aria-busy="true" aria-label="Cargando marcas...">
          <SkeletonCard v-for="n in 4" :key="n" variant="brand" />
        </div>

        <p v-else-if="brandsError" class="solutions__message solutions__message--error" role="alert">{{ brandsError }}</p>

        <p v-else-if="brands.length === 0" class="solutions__message">
          No hay soluciones disponibles en este momento.
        </p>

        <template v-else>
          <p class="solutions__hint">Elige una marca para ver sus productos.</p>

          <div ref="brandGrid" class="solutions__grid">
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
              ref="productsSection"
              :key="selectedBrand.id"
              :brand="selectedBrand"
              :services="services"
              :is-loading="isLoadingServices"
              :error="servicesError"
              :page="servicesPage"
              :total-pages="servicesTotalPages"
              :total-elements="servicesTotal"
              :page-size="pageSize"
              @page-change="changePage"
            />
          </Transition>
        </template>
      </div>
    </section>

    <BrandStickyBar
      :brands="brands"
      :selected-id="selectedBrand?.id ?? null"
      :visible="!!selectedBrand && isBrandGridPassed"
      @select="changeBrandFromBar"
      @show-all="showAllBrands"
    />
  </PageBackdrop>
</template>

<style scoped lang="scss">
.solutions {
  padding: 1rem 0 4rem;

  // White text with a soft shadow: readable over the photo
  &__hint { margin: 0 0 1.5rem; color: #fff; font-weight: 600; text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35); }
  &__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }

  // Messages inside a white box so they never get lost on the photo
  &__message { padding: 1.5rem; border-radius: 12px; background: #fff; text-align: center; color: var(--color-muted); }
  &__message--error { color: #b91c1c; }
}

@media (max-width: 1024px) {
  .solutions__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .solutions { padding: 0.5rem 0 2rem; }
  .solutions__grid { grid-template-columns: 1fr; }
}
</style>
