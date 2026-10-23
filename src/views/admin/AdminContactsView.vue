<script setup>
import { onMounted, ref } from 'vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import Pagination from '@/shared/Pagination.vue'
import ConfirmDialog from '@/shared/ConfirmDialog.vue'
import ContactStatusFilter from '@/components/admin/ContactStatusFilter.vue'
import ContactsTable from '@/components/admin/ContactsTable.vue'
import NoteDialog from '@/components/admin/NoteDialog.vue'
import { useAdminContacts } from '@/composables/admin/useAdminContacts'

const {
  contacts, status, page, totalPages, totalElements, isLoading, error, feedback, actionError,
  loadPage, changeStatus, updateContact, removeContact,
} = useAdminContacts()

const contactToArchive = ref(null) // shows the confirmation dialog
const contactWithNote = ref(null) // shows the note dialog
const contactToDelete = ref(null) // BGSI-308: shows the "delete for good" dialog

const SUCCESS_MESSAGES = {
  CONTACTED: 'Contacto marcado como contactado',
  ARCHIVED: 'Contacto archivado',
  NEW: 'Contacto restaurado',
}

async function handleChangeStatus(contact, newStatus) {
  // Archiving is the closest thing to deleting here: ask first
  if (newStatus === 'ARCHIVED') {
    contactToArchive.value = contact
    return
  }
  await updateContact(contact.id, { status: newStatus }, SUCCESS_MESSAGES[newStatus])
}

async function confirmArchive() {
  const contact = contactToArchive.value
  contactToArchive.value = null
  await updateContact(contact.id, { status: 'ARCHIVED' }, SUCCESS_MESSAGES.ARCHIVED)
}

// After "Borrar" the interceptor asks for the password (BGSI-275)
async function confirmDelete() {
  const contact = contactToDelete.value
  contactToDelete.value = null
  await removeContact(contact)
}

async function saveNote(note) {
  const contact = contactWithNote.value
  contactWithNote.value = null
  await updateContact(contact.id, { note }, note ? 'Nota guardada' : 'Nota eliminada')
}

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

    <Transition name="slide-fade">
      <p v-if="feedback" class="admin-contacts__feedback" role="status">{{ feedback }}</p>
    </Transition>
    <Transition name="slide-fade">
      <p v-if="actionError" class="admin-contacts__error" role="alert">{{ actionError }}</p>
    </Transition>

    <LoadingSpinner v-if="isLoading" label="Cargando contactos..." />
    <p v-else-if="error" class="admin-contacts__error" role="alert">{{ error }}</p>
    <template v-else>
      <ContactsTable :contacts="contacts" @change-status="handleChangeStatus" @edit-note="contactWithNote = $event"
                     @delete="contactToDelete = $event" />
      <Pagination :current-page="page" :total-pages="totalPages" @change="loadPage" />
    </template>

    <Transition name="slide-fade">
      <ConfirmDialog
        v-if="contactToArchive"
        title="Archivar contacto"
        :message="`¿Seguro que quieres archivar el mensaje de ${contactToArchive.name}? Podrás recuperarlo desde el filtro Archivados.`"
        confirm-label="Archivar"
        @confirm="confirmArchive"
        @cancel="contactToArchive = null"
      />
    </Transition>

    <Transition name="slide-fade">
      <ConfirmDialog
        v-if="contactToDelete"
        title="Borrar contacto"
        :message="`¿Seguro que quieres borrar el mensaje de ${contactToDelete.name}? Se borra para siempre y no se puede recuperar. Si solo quieres quitarlo de la lista, archívalo.`"
        confirm-label="Borrar para siempre"
        @confirm="confirmDelete"
        @cancel="contactToDelete = null"
      />
    </Transition>

    <Transition name="slide-fade">
      <NoteDialog
        v-if="contactWithNote"
        :contact-name="contactWithNote.name"
        :initial-note="contactWithNote.note || ''"
        @save="saveNote"
        @cancel="contactWithNote = null"
      />
    </Transition>
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

  &__feedback,
  &__error {
    margin: 0 0 1rem;
    padding: 0.9rem 1rem;
    border-radius: var(--radius);
  }

  &__feedback { color: #14532d; background: #dcfce7; }
  &__error { color: #7f1d1d; background: #fee2e2; }
}
</style>
