<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

// Full sheet of one product (BGSI-206)
const props = defineProps({
  service: { type: Object, required: true },
})

const features = computed(() => props.service.features ?? [])
const sectors = computed(() => props.service.sectors ?? [])

// If the image is missing or cannot be loaded, we show the initials instead
const imageFailed = ref(false)
watch(() => props.service.imageUrl, () => { imageFailed.value = false })
const showImage = computed(() => !!props.service.imageUrl && !imageFailed.value)

// "BDP .Net" -> "BN"
const initials = computed(() => props.service.name
  .replace(/[^\p{L}\p{N}\s]/gu, '')
  .split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join(''))
</script>

<template>
  <article class="product">
    <div class="product__media">
      <img v-if="showImage" :src="service.imageUrl" :alt="service.name" class="product__image"
           @error="imageFailed = true" />
      <div v-else class="product__placeholder" aria-hidden="true">{{ initials }}</div>
    </div>

    <div class="product__body">
      <span class="product__brand">{{ service.brandName }}</span>
      <h3 class="product__name">{{ service.name }}</h3>
      <p class="product__description">{{ service.longDescription || service.description }}</p>

      <div v-if="features.length" class="product__block">
        <h4 class="product__label">Qué hace</h4>
        <ul class="product__features">
          <li v-for="feature in features" :key="feature">{{ feature }}</li>
        </ul>
      </div>

      <div v-if="sectors.length" class="product__block">
        <h4 class="product__label">Ideal para</h4>
        <ul class="product__sectors">
          <li v-for="sector in sectors" :key="sector">{{ sector }}</li>
        </ul>
      </div>

      <div class="product__actions">
        <!-- BGSI-207: Contacto opens with this product already chosen -->
        <RouterLink :to="{ name: 'contact', query: { producto: service.name } }" class="btn btn--primary">
          Solicitar información
        </RouterLink>

        <!-- Maker's page, in a new tab. Only when the admin has filled it in -->
        <a v-if="service.officialUrl" :href="service.officialUrl" target="_blank" rel="noopener noreferrer"
           class="product__official">
          Ver ficha oficial <span aria-hidden="true">↗</span>
          <span class="sr-only">(se abre en otra pestaña)</span>
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.product {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  overflow: hidden;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(11, 31, 58, 0.1);

  &__media { min-height: 260px; background: var(--color-bg-alt); }
  &__image { display: block; width: 100%; height: 100%; object-fit: cover; }

  // Without image: navy box with the initials
  &__placeholder {
    display: grid;
    place-items: center;
    height: 100%;
    background: linear-gradient(135deg, #123461, #1e4a82);
    color: rgba(255, 255, 255, 0.9);
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    min-width: 0;
    padding: 1.75rem 2rem;
    overflow-wrap: anywhere;
  }

  &__brand {
    align-self: flex-start;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-orange-dark);
  }

  &__name { margin: -0.4rem 0 0; font-size: 1.4rem; color: var(--color-navy); }
  &__description { margin: 0; color: #475569; line-height: 1.6; }

  &__label {
    margin: 0 0 0.4rem;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-muted);
  }

  // "What it does": orange tick + text, two columns on desktop
  &__features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.35rem 1rem;
    margin: 0;
    padding: 0;
    list-style: none;

    li { position: relative; padding-left: 1.4rem; color: var(--color-navy); }
    li::before { content: '✓'; position: absolute; left: 0; font-weight: 700; color: var(--color-orange); }
  }

  // "Ideal for": small grey pills
  &__sectors {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: 0.25rem 0.7rem;
      border-radius: 999px;
      background: var(--color-bg-alt);
      color: var(--color-navy);
      font-size: 0.85rem;
      font-weight: 600;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1.25rem;
    margin-top: 0.25rem;
  }

  // Secondary link: navy text, orange on hover
  &__official {
    font-weight: 600;
    color: var(--color-navy);
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover,
    &:focus-visible { color: var(--color-orange-dark); }
  }
}

// Mobile: image on top, one column
@media (max-width: 760px) {
  .product { grid-template-columns: minmax(0, 1fr); }
  .product__media { min-height: 200px; aspect-ratio: 16 / 9; }
  .product__body { padding: 1.25rem; }
  .product__features { grid-template-columns: 1fr; }
}
</style>
