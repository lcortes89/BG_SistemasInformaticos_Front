<script setup>
import { computed, ref, watch } from 'vue'

// BGSI-244: only the brand of the client (logo + name).
// Rating and testimonial stay in the database for a future reviews section.
const props = defineProps({
  client: { type: Object, required: true },
})

// If there is no logo or it cannot be loaded, we show the initials instead
const logoFailed = ref(false)
watch(() => props.client.logoUrl, () => { logoFailed.value = false })
const showLogo = computed(() => !!props.client.logoUrl && !logoFailed.value)
</script>

<template>
  <article class="client-card">
    <img v-if="showLogo" :src="client.logoUrl" :alt="`Logo de ${client.name}`" class="client-card__logo"
         @error="logoFailed = true" />
    <span v-else class="client-card__badge" aria-hidden="true">{{ client.getInitials() }}</span>
    <h3 class="client-card__name">{{ client.name }}</h3>
  </article>
</template>

<style scoped lang="scss">
.client-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.75rem 1rem;
  text-align: center;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(11, 31, 58, 0.08);

  // Same size as the grey circle of the skeleton (BGSI-243), so nothing jumps
  &__logo,
  &__badge {
    width: 72px;
    height: 72px;
    border-radius: 50%;
  }

  &__logo {
    object-fit: contain;
    background: #fff;
    border: 1px solid #e6eaf0;
  }

  &__badge {
    display: grid;
    place-items: center;
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, #123461, #1e4a82);
  }

  &__name { margin: 0; font-size: 1rem; color: var(--color-navy); overflow-wrap: anywhere; }
}
</style>
