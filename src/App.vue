<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import DemoCta from '@/components/layout/DemoCta.vue'

const route = useRoute()

// The admin panel (AdminLayout) has its own sidebar and top bar
const isAdminPanel = computed(() => !!route.meta.requiresAuth)

// "Solicita tu demo" on every public view except the ones marked with hideDemoCta
const showDemoCta = computed(() => !isAdminPanel.value && !route.meta.hideDemoCta)
</script>

<template>
  <AppHeader v-if="!isAdminPanel" />
  <main>
    <RouterView />
  </main>
  <DemoCta v-if="showDemoCta" />
  <AppFooter v-if="!isAdminPanel" />
</template>
