<script setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import DemoCta from '@/components/layout/DemoCta.vue'
import DemoSideTab from '@/components/layout/DemoSideTab.vue'
import { useElementReached } from '@/composables/layout/useElementReached'

const route = useRoute()

// The admin panel (AdminLayout) has its own sidebar and top bar
const isAdminPanel = computed(() => !!route.meta.requiresAuth)

// Pages with a hero: the header floats over it, fully transparent
const overlayHeader = computed(() => !!route.meta.overlayHeader)

// "Solicita tu demo" on every public view except the ones marked with hideDemoCta
const showDemoCta = computed(() => !isAdminPanel.value && !route.meta.hideDemoCta)

// BGSI-236: the side tab hides once the visitor reaches the orange card at the bottom
const demoCta = ref(null)
const { isReached: isDemoCtaReached } = useElementReached(demoCta)
</script>

<template>
  <AppHeader v-if="!isAdminPanel" :overlay="overlayHeader" />
  <!-- The header is fixed: pages without hero leave its space free at the top -->
  <main :class="{ 'has-header-space': !isAdminPanel && !overlayHeader }">
    <RouterView />
  </main>

  <template v-if="showDemoCta">
    <DemoSideTab :hidden="isDemoCtaReached" />
    <DemoCta ref="demoCta" />
  </template>
  <!-- Pages without the orange card (Contacto): soft fade from white into the footer -->
  <div v-else-if="!isAdminPanel" class="footer-fade" aria-hidden="true"></div>

  <AppFooter v-if="!isAdminPanel" />
</template>

<style>
.has-header-space { padding-top: 72px; }

/* BGSI-236: same soft junction as behind the demo card */
.footer-fade {
  height: 90px;
  background: linear-gradient(to bottom, rgba(11, 31, 58, 0) 0%, rgba(11, 31, 58, 0.35) 45%, var(--color-navy) 100%);
}
</style>
