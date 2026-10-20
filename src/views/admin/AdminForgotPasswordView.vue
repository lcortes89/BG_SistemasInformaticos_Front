<script setup>
import { RouterLink } from 'vue-router'
import AuthPageCard from '@/components/admin/AuthPageCard.vue'
import { useForgotPasswordForm } from '@/composables/admin/usePasswordResetForms'

const props = defineProps({
  // Optional: lets the tests pass a fake AuthService
  authService: { type: Object, default: undefined },
})

const { form, errors, isSubmitting, isSent, submitError, submit } = useForgotPasswordForm(props.authService)
</script>

<template>
  <AuthPageCard title="¿Olvidaste tu contraseña?"
                :subtitle="isSent ? '' : 'Escribe tu email de administrador y te enviaremos un enlace para crear una nueva.'">
    <Transition name="slide-fade" mode="out-in">
      <div v-if="isSent" key="sent" class="reset-sent" role="status">
        <p class="reset-sent__icon" aria-hidden="true">✉️</p>
        <p><strong>Revisa tu correo.</strong></p>
        <p>Si <strong>{{ form.email.trim() }}</strong> está registrado, te hemos enviado un enlace para crear una nueva contraseña.</p>
        <p class="reset-sent__hint">El enlace caduca en 30 minutos. Si no lo ves, mira en la carpeta de spam.</p>
      </div>

      <form v-else key="form" class="admin-form" novalidate @submit.prevent="submit">
        <div class="admin-form__field">
          <label for="forgot-email">Email</label>
          <input id="forgot-email" v-model="form.email" type="email" autocomplete="username"
                 :aria-invalid="!!errors.email" aria-describedby="forgot-email-error" />
          <p v-if="errors.email" id="forgot-email-error" class="admin-form__error">{{ errors.email }}</p>
        </div>

        <p v-if="submitError" class="admin-form__alert" role="alert">{{ submitError }}</p>

        <button type="submit" class="btn btn--primary auth-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando...' : 'Enviar enlace' }}
        </button>
      </form>
    </Transition>

    <RouterLink :to="{ name: 'admin-login' }" class="auth-back">← Volver al acceso</RouterLink>
  </AuthPageCard>
</template>

<style scoped lang="scss">
.auth-submit { width: 100%; font: inherit; font-weight: 600; }

.reset-sent {
  padding: 1.25rem;
  border-radius: var(--radius);
  background: #ecfdf5;
  color: #065f46;
  text-align: center;

  p { margin: 0 0 0.6rem; }
  &__icon { font-size: 2rem; }
  &__hint { margin: 0 !important; font-size: 0.875rem; color: #047857; }
}

.auth-back {
  display: inline-block;
  margin-top: 1.5rem;
  color: var(--color-navy);
  font-weight: 600;
  text-decoration: none;

  &:hover { text-decoration: underline; }
}
</style>
