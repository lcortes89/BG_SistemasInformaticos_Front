<script setup>
import { onMounted } from 'vue'
import Hero from '@/components/home/Hero.vue'
import SectorSummary from '@/components/home/SectorSummary.vue'
import FeaturedServices from '@/components/home/FeaturedServices.vue'
import { useFeaturedServices } from '@/composables/home/useFeaturedServices'

const { services, isLoading, error, load } = useFeaturedServices()

// Load the featured services as soon as the page is shown
onMounted(load)
</script>

<template>
  <Hero />
  <SectorSummary />
  <FeaturedServices :services="services" :is-loading="isLoading" :error="error" />
</template>
