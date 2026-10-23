<script setup>
// BGSI-321: one paragraph of a legal page (see src/core/config/legal-pages.js)
defineProps({
  parts: { type: Array, required: true },
})
</script>

<template>
  <template v-for="(part, index) in parts" :key="index">
    <template v-if="typeof part === 'string'">{{ part }}</template>
    <strong v-else-if="part.strong">{{ part.strong }}</strong>
    <RouterLink v-else-if="part.to" :to="part.to">{{ part.text }}</RouterLink>
    <a v-else-if="part.href" :href="part.href" target="_blank" rel="noopener">{{ part.text }}</a>
  </template>
</template>
