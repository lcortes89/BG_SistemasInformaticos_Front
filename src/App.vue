<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import DemoCta from '@/components/layout/DemoCta.vue'

const route = useRoute()

// The admin panel (AdminLayout) has its own sidebar and top bar
const isAdminPanel = computed(() => !!route.meta.requiresAuth)

// Pages with a hero: the header floats over it, fully transparent
const overlayHeader = computed(() => !!route.meta.overlayHeader)

// "Solicita tu demo" on every public view except the ones marked with hideDemoCta
const showDemoCta = computed(() => !isAdminPanel.value && !route.meta.hideDemoCta)
</script>

<template>
  <AppHeader v-if="!isAdminPanel" :overlay="overlayHeader" />
  <!-- The header is fixed: pages without hero leave its space free at the top -->
  <main :class="{ 'has-header-space': !isAdminPanel && !overlayHeader }">
    <RouterView />
  </main>
  <DemoCta v-if="showDemoCta" />
  <AppFooter v-if="!isAdminPanel" />
</template>

<style>
.has-header-space { padding-top: 72px; }
</style>
