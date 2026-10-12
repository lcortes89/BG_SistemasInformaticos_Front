<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()

// The admin panel (AdminLayout) has its own sidebar and top bar
const isAdminPanel = computed(() => !!route.meta.requiresAuth)
</script>

<template>
  <AppHeader v-if="!isAdminPanel" />
  <main>
    <RouterView />
  </main>
  <AppFooter v-if="!isAdminPanel" />
</template>
