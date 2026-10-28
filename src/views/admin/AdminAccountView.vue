<script setup>
import AccountPageLayout from '@/components/admin/AccountPageLayout.vue'
import ChangePasswordForm from '@/components/admin/ChangePasswordForm.vue'
import { useChangePasswordForm } from '@/composables/admin/useChangePasswordForm'
import { useAuthStore } from '@/stores/auth'

// "Ajustes de perfil > Cambiar contraseña": who is logged in and the password (BGSI-272).
// BGSI-314: it was "Mi cuenta"; the email and the two-step verification have their own pages now
const props = defineProps({
  // Optional: lets the tests pass a fake AccountService
  accountService: { type: Object, default: undefined },
})

const authStore = useAuthStore()
const { form, errors, rules, isSubmitting, submitError, successMessage, submit, step, next, back } =
  useChangePasswordForm(props.accountService, authStore)
</script>

<template>
  <AccountPageLayout title="Cambiar contraseña">
    <template #subtitle>Has iniciado sesión como <strong>{{ authStore.email }}</strong>.</template>

    <template #feedback>
      <Transition name="slide-fade">
        <p v-if="successMessage" class="admin-page__feedback" role="status">{{ successMessage }}</p>
      </Transition>
    </template>

    <ChangePasswordForm :form="form" :errors="errors" :rules="rules" :step="step" :is-submitting="isSubmitting"
                        :submit-error="submitError" @continue="next" @back="back" @submit="submit" />

    <template #info>
      <ul>
        <li>Al cambiarla se <strong>cierra la sesión en tus otros dispositivos</strong>; aquí sigues conectad@.</li>
        <li>Usa una contraseña que <strong>no uses en otras webs</strong>.</li>
        <li>Si crees que alguien conoce tu contraseña, cámbiala cuanto antes.</li>
        <li>
          Activa la <RouterLink :to="{ name: 'admin-two-factor' }">verificación en dos pasos</RouterLink>:
          es la mejor protección para el panel.
        </li>
      </ul>
    </template>
  </AccountPageLayout>
</template>
