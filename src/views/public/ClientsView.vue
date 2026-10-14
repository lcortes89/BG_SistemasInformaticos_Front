<script setup>
import { onMounted } from 'vue'
import PageHero from '@/shared/PageHero.vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import Pagination from '@/shared/Pagination.vue'
import ClientCard from '@/components/clients/ClientCard.vue'
import { useClients } from '@/composables/clients/useClients'

const { clients, page, totalPages, isLoading, error, loadPage } = useClients()

async function changePage(pageIndex) {
  await loadPage(pageIndex)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => loadPage(0))
</script>

<template>
  <PageHero
    breadcrumb="Nuestros Clientes"
    eyebrow="Casos reales de transformación digital"
    title="Nuestros Clientes"
    subtitle="Negocios de hostelería y retail que ya confían en nosotros para digitalizar su día a día."
  >
    <span class="clients__badge">✓ Instalaciones homologadas en Asturias y Norte de España</span>
  </PageHero>

  <section class="clients">
    <div class="container">
      <LoadingSpinner v-if="isLoading" label="Cargando clientes..." />

      <p v-else-if="error" class="clients__message clients__message--error" role="alert">{{ error }}</p>

      <p v-else-if="clients.length === 0" class="clients__message">
        Aún no hay casos de éxito publicados.
      </p>

      <template v-else>
        <div class="clients__grid">
          <ClientCard v-for="client in clients" :key="client.id" :client="client" />
        </div>
        <Pagination :current-page="page" :total-pages="totalPages" @change="changePage" />
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.clients {
  padding: 3rem 0 4rem;

  &__badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    background: rgba(242, 140, 40, 0.15);
    color: #ffd7b0;
    font-size: 0.9rem;
    font-weight: 600;
  }

  &__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  &__message { text-align: center; color: var(--color-muted); }
  &__message--error { color: #b91c1c; }
}

@media (max-width: 900px) {
  .clients__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .clients__grid { grid-template-columns: 1fr; }
}
</style>
