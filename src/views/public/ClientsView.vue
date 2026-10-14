<script setup>
import { onMounted } from 'vue'
import PageHero from '@/shared/PageHero.vue'
import PageBackdrop from '@/shared/PageBackdrop.vue'
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
  <PageBackdrop>
    <PageHero
      transparent
      eyebrow="Casos reales de transformación digital"
      title="Nuestros Clientes"
      subtitle="Negocios de hostelería y retail que ya confían en nosotros para digitalizar su día a día."
    />

    <section class="clients">
      <div class="container">
        <!-- Moved out of the hero so every hero has the same height (BGSI-227) -->
        <span class="clients__badge">✓ Instalaciones homologadas en Asturias y Norte de España</span>

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
  </PageBackdrop>
</template>

<style scoped lang="scss">
.clients {
  padding: 1rem 0 4rem;

  // Glass pill over the photo
  &__badge {
    display: inline-block;
    margin-bottom: 1.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
    background: rgba(11, 31, 58, 0.45);
    backdrop-filter: blur(6px);
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
  }

  &__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }

  // Messages inside a white box so they never get lost on the photo
  &__message { padding: 1.5rem; border-radius: 12px; background: #fff; text-align: center; color: var(--color-muted); }
  &__message--error { color: #b91c1c; }
}

@media (max-width: 900px) {
  .clients__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .clients { padding: 0.5rem 0 2rem; }
  .clients__grid { grid-template-columns: 1fr; }
}
</style>
