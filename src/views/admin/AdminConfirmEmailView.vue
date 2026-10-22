<script setup>
import { onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AuthPageCard from '@/components/admin/AuthPageCard.vue'
import { useConfirmEmailChange } from '@/composables/admin/useConfirmEmailChange'
import { useAuthStore } from '@/stores/auth'

// BGSI-301: /admin/confirmar-email?token=... (the link sent to the new email)
const props = defineProps({
  // Optional: lets the tests pass a fake AuthService
  authService: { type: Object, default: undefined },
})

const route = useRoute()
const authStore = useAuthStore()
const token = typeof route.query.token === 'string' ? route.query.token : ''

// The backend closes every session of the admin: this browser logs out too
const { state, newEmail, errorMessage, confirm } =
  useConfirmEmailChange(token, props.authService, () => authStore.logout())

onMounted(confirm)

const titles = {
  loading: 'Confirmando tu email...',
  done: 'Email cambiado',
  invalid: 'El enlace no es válido',
  taken: 'No se ha podido cambiar',
  error: 'No se ha podido cambiar',
}
</script>

<template>
  <AuthPageCard :title="titles[state]">
    <p v-if="state === 'loading'" class="confirm-email__loading" role="status">
      <span class="confirm-email__spinner" aria-hidden="true" /> Un momento, por favor.
    </p>

    <div v-else-if="state === 'done'" class="confirm-email__box confirm-email__box--ok" role="status">
      <span class="confirm-email__icon" aria-hidden="true">✓</span>
      <p>Tu email de administrador ahora es</p>
      <p class="confirm-email__email" data-test="new-email">{{ newEmail }}</p>
      <p>Por seguridad hemos <strong>cerrado todas tus sesiones</strong>. Entra con tu email nuevo y tu contraseña de siempre.</p>
      <RouterLink :to="{ name: 'admin-login' }" class="btn btn--primary">Iniciar sesión</RouterLink>
    </div>

    <div v-else-if="state === 'invalid'" class="confirm-email__box" role="alert">
      <p><strong>El enlace ya se ha usado, ha caducado o se canceló el cambio.</strong></p>
      <p>Los enlaces sirven una vez y durante 1 hora. Tu email no ha cambiado: entra con el de siempre y pídelo otra vez desde <strong>Mi cuenta</strong>.</p>
      <RouterLink :to="{ name: 'admin-login' }" class="btn btn--primary">Ir a iniciar sesión</RouterLink>
    </div>

    <div v-else class="confirm-email__box" role="alert">
      <p v-if="state === 'taken'"><strong>Ese email ya lo usa otro administrador.</strong></p>
      <p v-else><strong>{{ errorMessage }}</strong></p>
      <p>Tu email no ha cambiado. Inténtalo más tarde o pide el cambio con otro email desde <strong>Mi cuenta</strong>.</p>
      <RouterLink :to="{ name: 'admin-login' }" class="btn btn--primary">Ir a iniciar sesión</RouterLink>
    </div>
  </AuthPageCard>
</template>

<style scoped lang="scss">
.confirm-email {
  &__loading { display: flex; align-items: center; gap: 0.75rem; margin: 0; color: var(--color-muted); }

  &__spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 3px solid #e2e8f0;
    border-top-color: var(--color-orange, #f28c28);
    border-radius: 50%;
    animation: confirm-email-spin 0.8s linear infinite;
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

  &__email { font-size: 1.1rem; font-weight: 700; color: var(--color-navy) !important; word-break: break-all; }
}

@keyframes confirm-email-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .confirm-email__spinner { animation-duration: 3s; }
}
</style>
