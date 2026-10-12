<script setup>
import { onMounted } from 'vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import Pagination from '@/shared/Pagination.vue'
import ContactStatusFilter from '@/components/admin/ContactStatusFilter.vue'
import ContactsTable from '@/components/admin/ContactsTable.vue'
import { useAdminContacts } from '@/composables/admin/useAdminContacts'

const { contacts, status, page, totalPages, totalElements, isLoading, error, loadPage, changeStatus } =
  useAdminContacts()

onMounted(() => loadPage(0))
</script>

<template>
  <section class="admin-contacts">
    <header class="admin-contacts__header">
      <div>
        <h1>Contactos</h1>
        <p>{{ totalElements }} {{ totalElements === 1 ? 'mensaje' : 'mensajes' }}</p>
      </div>
      <ContactStatusFilter :model-value="status" @update:model-value="changeStatus" />
    </header>

    <LoadingSpinner v-if="isLoading" label="Cargando contactos..." />
    <p v-else-if="error" class="admin-contacts__error" role="alert">{{ error }}</p>
    <template v-else>
      <ContactsTable :contacts="contacts" />
      <Pagination :current-page="page" :total-pages="totalPages" @change="loadPage" />
    </template>
  </section>
</template>

<style scoped lang="scss">
.admin-contacts {
  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;

    h1 { margin: 0 0 0.25rem; color: var(--color-navy); }
    p { margin: 0; color: var(--color-muted); }
  }

  &__error {
    padding: 0.9rem 1rem;
    color: #7f1d1d;
    background: #fee2e2;
    border-radius: var(--radius);
  }
}
</style>
