<script setup>
import { onMounted, ref } from 'vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import Pagination from '@/shared/Pagination.vue'
import ModalDialog from '@/shared/ModalDialog.vue'
import ConfirmDialog from '@/shared/ConfirmDialog.vue'
import ExportMenu from '@/shared/ExportMenu.vue'
import ClientsTable from '@/components/admin/ClientsTable.vue'
import ClientForm from '@/components/admin/ClientForm.vue'
import AdminClientService from '@/core/apis/client/AdminClientService'
import { useAdminCrud } from '@/composables/admin/useAdminCrud'

const {
  items: clients, page, totalPages, totalElements, isLoading, isSaving, error, feedback, actionError,
  loadPage, save, remove,
} = useAdminCrud(new AdminClientService())

const formOpen = ref(false)
const clientToEdit = ref(null) // null = new client
const clientToDelete = ref(null)
const formError = ref(null)

function openForm(client = null) {
  clientToEdit.value = client
  formError.value = null
  formOpen.value = true
}

async function submitForm(form) {
  formError.value = null
  try {
    const isEdit = !!clientToEdit.value
    await save(clientToEdit.value?.id ?? null, form, isEdit ? 'Cliente actualizado' : 'Cliente creado')
    formOpen.value = false
  } catch (e) {
    formError.value = e.message
  }
}

async function confirmDelete() {
  const client = clientToDelete.value
  clientToDelete.value = null
  await remove(client.id, `Cliente ${client.name} borrado`)
}

onMounted(() => loadPage(0))
</script>

<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>Clientes</h1>
        <p>{{ totalElements }} {{ totalElements === 1 ? 'caso de éxito' : 'casos de éxito' }}</p>
      </div>
      <div class="admin-page__tools">
        <ExportMenu resource="clients" />
        <button type="button" class="btn btn--primary admin-page__new" @click="openForm()">+ Nuevo cliente</button>
      </div>
    </header>

    <Transition name="slide-fade">
      <p v-if="feedback" class="admin-page__feedback" role="status">{{ feedback }}</p>
    </Transition>
    <Transition name="slide-fade">
      <p v-if="actionError" class="admin-page__error" role="alert">{{ actionError }}</p>
    </Transition>

    <LoadingSpinner v-if="isLoading" label="Cargando clientes..." />
    <p v-else-if="error" class="admin-page__error" role="alert">{{ error }}</p>
    <template v-else>
      <ClientsTable :clients="clients" @edit="openForm" @delete="clientToDelete = $event" />
      <Pagination :current-page="page" :total-pages="totalPages" @change="loadPage" />
    </template>

    <Transition name="slide-fade">
      <ModalDialog v-if="formOpen" :title="clientToEdit ? 'Editar cliente' : 'Nuevo cliente'" @close="formOpen = false">
        <ClientForm :client="clientToEdit" :is-saving="isSaving" :server-error="formError"
                    @submit="submitForm" @cancel="formOpen = false" />
      </ModalDialog>
    </Transition>

    <Transition name="slide-fade">
      <ConfirmDialog
        v-if="clientToDelete"
        title="Borrar cliente"
        :message="`¿Seguro que quieres borrar a ${clientToDelete.name}? Esta acción no se puede deshacer.`"
        confirm-label="Borrar"
        @confirm="confirmDelete"
        @cancel="clientToDelete = null"
      />
    </Transition>
  </section>
</template>
