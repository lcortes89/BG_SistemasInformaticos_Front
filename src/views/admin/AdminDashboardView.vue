<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import StatCard from '@/components/admin/StatCard.vue'
import LatestContacts from '@/components/admin/LatestContacts.vue'
import { useAdminSummary } from '@/composables/admin/useAdminSummary'

const { summary, isLoading, error, load } = useAdminSummary()

// The 4 counters of the prototype
const cards = computed(() => [
  {
    label: 'Contactos nuevos', icon: '✉', value: summary.value.newContacts,
    detail: `de ${summary.value.totalContacts} en total`, to: { name: 'admin-contacts' }, linkLabel: 'Revisar',
  },
  {
    label: 'Productos destacados', icon: '★', value: summary.value.featuredServices,
    detail: `de ${summary.value.totalServices} en catálogo`, to: { name: 'admin-services' }, linkLabel: 'Gestionar',
  },
  {
    label: 'Marcas activas', icon: '◆', value: summary.value.activeBrands,
    detail: `de ${summary.value.totalBrands} fabricantes`, to: { name: 'admin-brands' }, linkLabel: 'Gestionar',
  },
  {
    label: 'Clientes publicados', icon: '☺', value: summary.value.publishedClients,
    detail: `de ${summary.value.totalClients} casos de éxito`, to: { name: 'admin-clients' }, linkLabel: 'Gestionar',
  },
])

onMounted(load)
</script>

<template>
  <section class="dashboard">
    <header class="dashboard__hero">
      <p class="dashboard__eyebrow"><span aria-hidden="true">●</span> Sistema en línea · Gestión centralizada</p>
      <h1>Panel de Control Integral · BG Sistemas</h1>
      <p>Supervisión de los contactos recibidos, el catálogo de soluciones y los casos de éxito publicados en la web.</p>
    </header>

    <p v-if="error" class="admin-page__error" role="alert">{{ error }}</p>

    <div class="dashboard__cards">
      <StatCard v-for="card in cards" :key="card.label" v-bind="card" :is-loading="isLoading" />
    </div>

    <section class="dashboard__latest" aria-labelledby="latest-title">
      <header class="dashboard__latest-header">
        <div>
          <h2 id="latest-title">Últimos contactos recibidos</h2>
          <p>Los 5 mensajes más recientes del formulario de la web.</p>
        </div>
        <RouterLink :to="{ name: 'admin-contacts' }" class="dashboard__all">Ver todos →</RouterLink>
      </header>
      <LatestContacts v-if="!isLoading" :contacts="summary.latestContacts" />
    </section>
  </section>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  &__hero {
    padding: 2rem;
    color: #fff;
    background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%);
    border-radius: var(--radius);

    h1 { margin: 0 0 0.5rem; font-size: 1.9rem; }
    p { margin: 0; max-width: 640px; color: #cbd5e1; }
  }

  &__eyebrow {
    display: inline-flex;
    gap: 0.4rem;
    margin-bottom: 0.75rem !important;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-orange) !important;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 999px;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }

  &__latest {
    padding: 1.5rem;
    background: #fff;
    border-radius: var(--radius);
    box-shadow: 0 2px 10px rgba(11, 31, 58, 0.06);
  }

  &__latest-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;

    h2 { margin: 0 0 0.25rem; font-size: 1.3rem; color: var(--color-navy); }
    p { margin: 0; color: var(--color-muted); }
  }

  &__all { font-weight: 600; color: var(--color-orange-dark); text-decoration: none; }
}

@media (max-width: 1100px) {
  .dashboard__cards { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .dashboard__cards { grid-template-columns: 1fr; }
  .dashboard__hero { padding: 1.5rem; }
  .dashboard__hero h1 { font-size: 1.5rem; }
}
</style>
