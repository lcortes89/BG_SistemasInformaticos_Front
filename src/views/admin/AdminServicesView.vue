<script setup>
import { onMounted, ref } from 'vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import Pagination from '@/shared/Pagination.vue'
import ModalDialog from '@/shared/ModalDialog.vue'
import ConfirmDialog from '@/shared/ConfirmDialog.vue'
import ServicesTable from '@/components/admin/ServicesTable.vue'
import ServiceForm from '@/components/admin/ServiceForm.vue'
import AdminServiceService from '@/core/apis/service/AdminServiceService'
import AdminBrandService from '@/core/apis/brand/AdminBrandService'
import { useAdminCrud } from '@/composables/admin/useAdminCrud'

const {
  items: services, filters, page, totalPages, totalElements, isLoading, isSaving, error, feedback, actionError,
  loadPage, setFilter, save, remove,
} = useAdminCrud(new AdminServiceService())

const brandService = new AdminBrandService()
const brands = ref([])
const formOpen = ref(false)
const serviceToEdit = ref(null) // null = new service
const serviceToDelete = ref(null)
const formError = ref(null)

function openForm(service = null) {
  serviceToEdit.value = service
  formError.value = null
  formOpen.value = true
}

async function submitForm(form) {
  formError.value = null
  try {
    const isEdit = !!serviceToEdit.value
    await save(serviceToEdit.value?.id ?? null, form, isEdit ? 'Producto actualizado' : 'Producto creado')
    formOpen.value = false
  } catch (e) {
    formError.value = e.message
  }
}

async function confirmDelete() {
  const service = serviceToDelete.value
  serviceToDelete.value = null
  await remove(service.id, `Producto ${service.name} borrado`)
}

onMounted(async () => {
  loadPage(0)
  try {
    brands.value = await brandService.getOptions()
  } catch {
    brands.value = [] // the table still works; the form will show an empty selector
  }
})
</script>

<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>Productos</h1>
        <p>{{ totalElements }} {{ totalElements === 1 ? 'producto' : 'productos' }}</p>
      </div>
      <div class="admin-page__tools">
        <label for="brand-filter" class="sr-only">Filtrar por marca</label>
        <select id="brand-filter" :value="filters.brandId ?? ''"
                @change="setFilter('brandId', $event.target.value ? Number($event.target.value) : null)">
          <option value="">Todas las marcas</option>
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
        </select>
        <button type="button" class="btn btn--primary admin-page__new" @click="openForm()">+ Nuevo producto</button>
      </div>
    </header>

    <Transition name="slide-fade">
      <p v-if="feedback" class="admin-page__feedback" role="status">{{ feedback }}</p>
    </Transition>
    <Transition name="slide-fade">
      <p v-if="actionError" class="admin-page__error" role="alert">{{ actionError }}</p>
    </Transition>

    <LoadingSpinner v-if="isLoading" label="Cargando productos..." />
    <p v-else-if="error" class="admin-page__error" role="alert">{{ error }}</p>
    <template v-else>
      <ServicesTable :services="services" @edit="openForm" @delete="serviceToDelete = $event" />
      <Pagination :current-page="page" :total-pages="totalPages" @change="loadPage" />
    </template>

    <Transition name="slide-fade">
      <ModalDialog v-if="formOpen" :title="serviceToEdit ? 'Editar producto' : 'Nuevo producto'" @close="formOpen = false">
        <ServiceForm :service="serviceToEdit" :brands="brands" :is-saving="isSaving" :server-error="formError"
                     @submit="submitForm" @cancel="formOpen = false" />
      </ModalDialog>
    </Transition>

    <Transition name="slide-fade">
      <ConfirmDialog
        v-if="serviceToDelete"
        title="Borrar producto"
        :message="`¿Seguro que quieres borrar ${serviceToDelete.name}? Esta acción no se puede deshacer.`"
        confirm-label="Borrar"
        @confirm="confirmDelete"
        @cancel="serviceToDelete = null"
      />
    </Transition>
  </section>
</template>
