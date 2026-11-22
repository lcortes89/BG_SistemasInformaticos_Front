<script setup>
import { onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AuthPageCard from '@/components/admin/AuthPageCard.vue'
import { useVerifyEmail } from '@/composables/admin/useVerifyEmail'

// BGSI-240: /admin/verificar-email?token=... (the link sent to a new admin)
const props = defineProps({
  // Optional: lets the tests pass a fake AuthService
  authService: { type: Object, default: undefined },
})

const route = useRoute()
const token = typeof route.query.token === 'string' ? route.query.token : ''

const { state, errorMessage, resendState, verify, resend } = useVerifyEmail(token, props.authService)

onMounted(verify)

const titles = {
  loading: 'Verificando tu email...',
  done: 'Cuenta verificada',
  invalid: 'El enlace no es válido',
  error: 'No se ha podido verificar',
}
</script>

<template>
  <AuthPageCard :title="titles[state]">
    <p v-if="state === 'loading'" class="verify-email__loading" role="status">
      <span class="verify-email__spinner" aria-hidden="true" /> Un momento, por favor.
    </p>

    <div v-else-if="state === 'done'" class="verify-email__box verify-email__box--ok" role="status">
      <span class="verify-email__icon" aria-hidden="true">✓</span>
      <p>Tu cuenta de administrador ya está activa. Entra con tu email y tu contraseña.</p>
      <RouterLink :to="{ name: 'admin-login' }" class="btn btn--primary">Iniciar sesión</RouterLink>
    </div>

    <div v-else-if="state === 'invalid'" class="verify-email__box" role="alert">
      <p><strong>El enlace ya se ha usado o ha caducado.</strong></p>
      <p>Los enlaces sirven una vez y durante 24 horas.</p>

      <p v-if="resendState === 'sent'" class="verify-email__sent" role="status">
        Si la cuenta está pendiente, te hemos enviado un enlace nuevo. Revisa tu correo.
      </p>
      <template v-else>
        <p v-if="resendState === 'error'"><strong>No se ha podido enviar el enlace. Inténtalo más tarde.</strong></p>
        <button v-if="token" type="button" class="btn btn--secondary" data-test="resend"
                :disabled="resendState === 'sending'" @click="resend">
          {{ resendState === 'sending' ? 'Enviando...' : 'Enviarme un enlace nuevo' }}
        </button>
      </template>
    </div>

    <div v-else class="verify-email__box" role="alert">
      <p><strong>{{ errorMessage }}</strong></p>
      <p>Inténtalo más tarde abriendo de nuevo el enlace del correo.</p>
    </div>
  </AuthPageCard>
</template>

<style scoped lang="scss">
.verify-email {
  &__loading { display: flex; align-items: center; gap: 0.75rem; margin: 0; color: var(--color-muted); }

  &__spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 3px solid #e2e8f0;
    border-top-color: var(--color-orange, #f28c28);
    border-radius: 50%;
    animation: verify-email-spin 0.8s linear infinite;
  }

  &__box {
    padding: 1.25rem;
    border-radius: var(--radius);
    background: #fef2f2;
    color: #7f1d1d;
    text-align: center;
    line-height: 1.5;

    p { margin: 0 0 0.6rem; }
    .btn { margin-top: 0.5rem; text-decoration: none; }

    &--ok { background: #ecfdf5; color: #065f46; }
  }

  &__sent { color: #065f46; font-weight: 600; }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 0.5rem;
    border-radius: 50%;
    font-weight: 700;
    color: #fff;
    background: #10b981;
  }
}

@keyframes verify-email-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .verify-email__spinner { animation-duration: 3s; }
}
</style>
