<script setup>
import { onMounted } from 'vue'
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
  <section class="clients">
    <div class="container">
      <header class="clients__header">
        <h1>Nuestros Clientes</h1>
        <p>Negocios de hostelería y pymes que ya confían en nosotros.</p>
      </header>

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
  padding: 4rem 0;

  &__header {
    max-width: 720px;
    margin: 0 auto 3rem;
    text-align: center;

    h1 { margin: 0 0 1rem; color: var(--color-navy); }
    p { margin: 0; color: var(--color-muted); }
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
