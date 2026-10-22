<script setup>
import ChangePasswordForm from '@/components/admin/ChangePasswordForm.vue'
import ChangeEmailCard from '@/components/admin/ChangeEmailCard.vue'
import TwoFactorCard from '@/components/admin/TwoFactorCard.vue'
import { useChangePasswordForm } from '@/composables/admin/useChangePasswordForm'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  // Optional: lets the tests pass a fake AccountService
  accountService: { type: Object, default: undefined },
})

const authStore = useAuthStore()
const { form, errors, rules, isSubmitting, submitError, successMessage, submit, step, next, back } =
  useChangePasswordForm(props.accountService, authStore)
</script>

<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>Mi cuenta</h1>
        <p>Has iniciado sesión como <strong>{{ authStore.email }}</strong>.</p>
      </div>
    </header>

    <Transition name="slide-fade">
      <p v-if="successMessage" class="admin-page__feedback" role="status">{{ successMessage }}</p>
    </Transition>

    <div class="admin-account">
      <div class="admin-account__card">
        <h2 class="admin-account__title">Cambiar contraseña</h2>
        <ChangePasswordForm :form="form" :errors="errors" :rules="rules" :step="step" :is-submitting="isSubmitting"
                            :submit-error="submitError" @continue="next" @back="back" @submit="submit" />
      </div>

      <!-- BGSI-301 -->
      <div class="admin-account__card admin-account__card--wide">
        <ChangeEmailCard :current-email="authStore.email" :service="accountService" />
      </div>

      <!-- BGSI-276 -->
      <div class="admin-account__card admin-account__card--wide">
        <TwoFactorCard :service="accountService" />
      </div>

      <aside class="admin-account__info">
        <h2 class="admin-account__title">Ten en cuenta</h2>
        <ul>
          <li>Al cambiarla se <strong>cierra la sesión en tus otros dispositivos</strong>; aquí sigues conectad@.</li>
          <li>Para cambiar tu email te enviamos un <strong>enlace al email nuevo</strong>: el cambio se hace al abrirlo y después entras con el nuevo.</li>
          <li>Usa una contraseña que <strong>no uses en otras webs</strong>.</li>
          <li>Si crees que alguien conoce tu contraseña, cámbiala cuanto antes.</li>
          <li>Activa la <strong>verificación en dos pasos</strong>: es la mejor protección para el panel.</li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.admin-account {
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
    .admin-account__title { color: #fff; }
  }

  &__title { margin: 0 0 1.25rem; font-size: 1.15rem; color: var(--color-navy); }

  // BGSI-276 / BGSI-301: the email and two-step verification cards go under the password one
  &__card--wide { grid-column: 1; }
  &__info { grid-column: 2; grid-row: 1 / span 3; }
}

@media (max-width: 900px) {
  .admin-account { grid-template-columns: 1fr; }
  .admin-account__card--wide,
  .admin-account__info { grid-column: auto; grid-row: auto; }
}
</style>
