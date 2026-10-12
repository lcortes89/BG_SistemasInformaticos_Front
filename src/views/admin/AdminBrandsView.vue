<script setup>
import { onMounted, ref } from 'vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import Pagination from '@/shared/Pagination.vue'
import ModalDialog from '@/shared/ModalDialog.vue'
import ConfirmDialog from '@/shared/ConfirmDialog.vue'
import BrandsTable from '@/components/admin/BrandsTable.vue'
import BrandForm from '@/components/admin/BrandForm.vue'
import AdminBrandService from '@/core/apis/brand/AdminBrandService'
import { useAdminCrud } from '@/composables/admin/useAdminCrud'

const {
  items: brands, page, totalPages, totalElements, isLoading, isSaving, error, feedback, actionError,
  loadPage, save, remove,
} = useAdminCrud(new AdminBrandService(), {
  conflictMessage: 'No se puede borrar: esta marca tiene productos. Bórralos o cámbialos de marca primero.',
})

const formOpen = ref(false)
const brandToEdit = ref(null) // null = new brand
const brandToDelete = ref(null)
const formError = ref(null)

function openForm(brand = null) {
  brandToEdit.value = brand
  formError.value = null
  formOpen.value = true
}

async function submitForm(form) {
  formError.value = null
  try {
    const isEdit = !!brandToEdit.value
    await save(brandToEdit.value?.id ?? null, form, isEdit ? 'Marca actualizada' : 'Marca creada')
    formOpen.value = false
  } catch (e) {
    formError.value = e.message
  }
}

async function confirmDelete() {
  const brand = brandToDelete.value
  brandToDelete.value = null
  await remove(brand.id, `Marca ${brand.name} borrada`)
}

onMounted(() => loadPage(0))
</script>

<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>Marcas</h1>
        <p>{{ totalElements }} {{ totalElements === 1 ? 'marca' : 'marcas' }}</p>
      </div>
      <button type="button" class="btn btn--primary admin-page__new" @click="openForm()">+ Nueva marca</button>
    </header>

    <Transition name="slide-fade">
      <p v-if="feedback" class="admin-page__feedback" role="status">{{ feedback }}</p>
    </Transition>
    <Transition name="slide-fade">
      <p v-if="actionError" class="admin-page__error" role="alert">{{ actionError }}</p>
    </Transition>

    <LoadingSpinner v-if="isLoading" label="Cargando marcas..." />
    <p v-else-if="error" class="admin-page__error" role="alert">{{ error }}</p>
    <template v-else>
      <BrandsTable :brands="brands" @edit="openForm" @delete="brandToDelete = $event" />
      <Pagination :current-page="page" :total-pages="totalPages" @change="loadPage" />
    </template>

    <Transition name="slide-fade">
      <ModalDialog v-if="formOpen" :title="brandToEdit ? 'Editar marca' : 'Nueva marca'" @close="formOpen = false">
        <BrandForm :brand="brandToEdit" :is-saving="isSaving" :server-error="formError"
                   @submit="submitForm" @cancel="formOpen = false" />
      </ModalDialog>
    </Transition>

    <Transition name="slide-fade">
      <ConfirmDialog
        v-if="brandToDelete"
        title="Borrar marca"
        :message="`¿Seguro que quieres borrar ${brandToDelete.name}? Esta acción no se puede deshacer.`"
        confirm-label="Borrar"
        @confirm="confirmDelete"
        @cancel="brandToDelete = null"
      />
    </Transition>
  </section>
</template>
