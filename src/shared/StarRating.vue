<script setup>
defineProps({
  rating: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
})
</script>

<template>
  <span class="stars" role="img" :aria-label="`Valoración: ${rating} de ${max}`">
    <span v-for="star in max" :key="star" class="stars__star" :class="{ 'stars__star--filled': star <= rating }" aria-hidden="true">★</span>
  </span>
</template>

<style scoped>
.stars { display: inline-flex; gap: 2px; font-size: 1.1rem; }
.stars__star { color: #d1d5db; }
.stars__star--filled { color: var(--color-orange); }
</style>
