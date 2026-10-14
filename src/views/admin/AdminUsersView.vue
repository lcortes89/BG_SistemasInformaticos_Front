<script setup>
import NewAdminForm from '@/components/admin/NewAdminForm.vue'
import { useNewAdminForm } from '@/composables/admin/useNewAdminForm'

const { form, errors, isSubmitting, submitError, successMessage, submit } = useNewAdminForm()
</script>

<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>Administradores</h1>
        <p>Da de alta a otra persona para que gestione el panel.</p>
      </div>
    </header>

    <Transition name="slide-fade">
      <p v-if="successMessage" class="admin-page__feedback" role="status">{{ successMessage }}</p>
    </Transition>

    <div class="admin-users">
      <div class="admin-users__card">
        <h2 class="admin-users__title">Nuevo administrador</h2>
        <NewAdminForm :form="form" :errors="errors" :is-submitting="isSubmitting"
                      :submit-error="submitError" @submit="submit" />
      </div>

      <aside class="admin-users__info">
        <h2 class="admin-users__title">Ten en cuenta</h2>
        <ul>
          <li>El nuevo administrador tendrá <strong>los mismos permisos</strong> que tú.</li>
          <li>Podrá gestionar contactos, marcas, productos, clientes y tarifas.</li>
          <li>Entra por <strong>/admin/login</strong> con el email y la contraseña que pongas aquí.</li>
          <li>Comunícale la contraseña por un canal seguro.</li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.admin-users {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  max-width: 1000px;
  gap: 1.5rem;
  align-items: start;

  &__card,
  &__info {
    padding: 1.75rem;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(11, 31, 58, 0.08);
  }

  &__info {
    background: var(--color-navy);
    color: #e3eaf4;

    ul { margin: 0; padding-left: 1.1rem; line-height: 1.6; }
    li + li { margin-top: 0.5rem; }
    strong { color: #fff; }
    .admin-users__title { color: #fff; }
  }

  &__title { margin: 0 0 1.25rem; font-size: 1.15rem; color: var(--color-navy); }
}

@media (max-width: 900px) {
  .admin-users { grid-template-columns: 1fr; }
}
</style>
