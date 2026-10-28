<script setup>
defineProps({
  service: { type: Object, required: true },
})
</script>

<template>
  <article class="service-card">
    <span v-if="service.brandName" class="service-card__brand">{{ service.brandName }}</span>
    <h3 class="service-card__name">{{ service.name }}</h3>
    <p class="service-card__description">{{ service.description }}</p>
  </article>
</template>

<style scoped>
.service-card {
  display: flex; flex-direction: column; gap: 0.5rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: var(--radius);
  border-top: 4px solid var(--color-orange);
  box-shadow: 0 4px 16px rgba(11, 31, 58, 0.08);
}
.service-card__brand {
  align-self: flex-start;
  padding: 0.15rem 0.6rem;
  font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
  color: var(--color-navy); background: var(--color-bg-alt);
  border-radius: 999px;
}
.service-card__name { margin: 0; font-size: 1.15rem; color: var(--color-navy); }
.service-card__description { margin: 0; color: var(--color-muted); }
</style>
