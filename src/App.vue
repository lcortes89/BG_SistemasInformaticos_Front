<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import DemoCta from '@/components/layout/DemoCta.vue'
import DemoSideTab from '@/components/layout/DemoSideTab.vue'
import { useElementReached } from '@/composables/layout/useElementReached'
import { useHeroImage } from '@/composables/layout/useHeroImage'

const route = useRoute()

// The admin panel (AdminLayout) has its own sidebar and top bar
const isAdminPanel = computed(() => !!route.meta.requiresAuth)

// BGSI-324: the whole admin area (login, password pages and panel) only shows the copyright bar
const isAdminArea = computed(() => route.path.startsWith('/admin'))

// Pages with a hero: the header floats over it, fully transparent
const overlayHeader = computed(() => !!route.meta.overlayHeader)

// "Solicita tu demo" on every public view except the ones marked with hideDemoCta
const showDemoCta = computed(() => !isAdminPanel.value && !route.meta.hideDemoCta)

// BGSI-236: the side tab hides once the visitor reaches the orange card at the bottom
const demoCta = ref(null)
const { isReached: isDemoCtaReached } = useElementReached(demoCta)

// BGSI-231: the photo of the public heroes is read once, when the app starts
const { loadHeroImage } = useHeroImage()
onMounted(loadHeroImage)
</script>

<template>
  <AppHeader v-if="!isAdminPanel" :overlay="overlayHeader" :show-nav="!route.meta.hideNav" />
  <!-- The header is fixed: pages without hero leave its space free at the top -->
  <main :class="{ 'has-header-space': !isAdminPanel && !overlayHeader, 'is-admin-area': isAdminArea }">
    <RouterView />
  </main>

  <template v-if="showDemoCta">
    <DemoSideTab :hidden="isDemoCtaReached" />
    <DemoCta ref="demoCta" />
  </template>
  <!-- Pages without the orange card (Contacto): soft fade from white into the footer -->
  <div v-else-if="!isAdminArea" class="footer-fade" aria-hidden="true"></div>

  <AppFooter :compact="isAdminArea" />
</template>

<style>
.has-header-space { padding-top: 72px; }

/* BGSI-324: short admin pages (login...) fill the screen, so the copyright bar stays at the bottom */
.is-admin-area { min-height: calc(100vh - 3.3rem); background: var(--color-bg-alt); }

/* BGSI-236: same soft junction as behind the demo card */
.footer-fade {
  height: 90px;
  background: linear-gradient(to bottom, rgba(11, 31, 58, 0) 0%, rgba(11, 31, 58, 0.35) 45%, var(--color-navy) 100%);
}
</style>
