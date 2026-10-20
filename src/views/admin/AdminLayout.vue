<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useConfirmationStore } from '@/stores/confirmation'
import { useIdleLogout } from '@/composables/admin/useIdleLogout'
import { IDLE_WARNING_MS, LOGOUT_REASON_KEY } from '@/core/config/session'
import IdleWarningDialog from '@/components/admin/IdleWarningDialog.vue'
import ConfirmPasswordDialog from '@/components/admin/ConfirmPasswordDialog.vue'
import logo from '@/assets/logo/logo_header.png'

const authStore = useAuthStore()
const confirmation = useConfirmationStore()
const router = useRouter()

// BGSI-275: the password was right -> the waiting action is repeated with the token
function onPasswordConfirmed({ token, expiresInSeconds }) {
  confirmation.confirmed(token, expiresInSeconds, authStore.email)
}

const links = [
  { to: { name: 'admin-dashboard' }, label: 'Resumen' },
  { to: { name: 'admin-contacts' }, label: 'Contactos' },
  { to: { name: 'admin-brands' }, label: 'Marcas' },
  { to: { name: 'admin-services' }, label: 'Productos' },
  { to: { name: 'admin-clients' }, label: 'Clientes' },
  { to: { name: 'admin-rates' }, label: 'Tarifas' },
  { to: { name: 'admin-settings' }, label: 'Ajustes' },
  { to: { name: 'admin-users' }, label: 'Administradores' },
  { to: { name: 'admin-account' }, label: 'Mi cuenta' },
]

function logout() {
  confirmation.clear()
  authStore.logout()
  router.push({ name: 'admin-login' })
}

// BGSI-268: closed for inactivity. The reason is saved first so the other tabs show the same message
function logoutForInactivity() {
  try {
    localStorage.setItem(LOGOUT_REASON_KEY, 'idle')
  } catch {
    // storage blocked: only this tab shows the message
  }
  confirmation.cancel()
  confirmation.clear()
  authStore.logout()
  router.push({ name: 'admin-login', query: { reason: 'idle' } })
}

const idle = useIdleLogout({ onTimeout: logoutForInactivity })
const { isWarning, secondsLeft } = idle
onMounted(idle.start)
onBeforeUnmount(idle.stop)

function logoutNow() {
  idle.stop()
  logout()
}
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-layout__sidebar">
      <img :src="logo" alt="BG Sistemas Informáticos" class="admin-layout__logo" />
      <nav class="admin-layout__nav" aria-label="Navegación de administración">
        <RouterLink v-for="link in links" :key="link.label" :to="link.to" class="admin-layout__link"
                    exact-active-class="admin-layout__link--active">
          {{ link.label }}
        </RouterLink>
      </nav>
    </aside>

    <div class="admin-layout__main">
      <header class="admin-layout__topbar">
        <span>Sesión iniciada como <strong>{{ authStore.email }}</strong></span>
        <button type="button" class="btn btn--primary admin-layout__logout" @click="logout">Cerrar sesión</button>
      </header>
      <div class="admin-layout__content">
        <RouterView />
      </div>
    </div>

    <Transition name="slide-fade">
      <ConfirmPasswordDialog v-if="confirmation.isOpen" @confirmed="onPasswordConfirmed" @cancel="confirmation.cancel" />
    </Transition>

    <Transition name="slide-fade">
      <IdleWarningDialog v-if="isWarning" :seconds-left="secondsLeft" :total-seconds="IDLE_WARNING_MS / 1000"
                         @stay="idle.markActivity" @logout="logoutNow" />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;

  &__sidebar {
    padding: 1.5rem 1rem;
    background: var(--color-navy);
  }

  &__logo { display: block; height: 48px; margin: 0 0 2rem 0.5rem; }

  &__nav { display: flex; flex-direction: column; gap: 0.25rem; }

  &__link {
    padding: 0.7rem 0.9rem;
    font-weight: 500;
    color: #fff;
    text-decoration: none;
    border-radius: var(--radius);

    &:hover { background: var(--color-navy-light); }

    &--active {
      color: var(--color-navy);
      background: var(--color-orange);

      &:hover { background: var(--color-orange); }
    }
  }

  &__main { display: flex; flex-direction: column; background: var(--color-bg-alt); }

  &__topbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1rem 2rem;
    color: var(--color-muted);
    background: #fff;
    border-bottom: 1px solid #eef0f3;
  }

  &__logout { font: inherit; font-weight: 600; }

  &__content { padding: 2rem; }
}

@media (max-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr;

    &__sidebar { padding: 1rem; }
    &__logo { margin: 0 0 1rem; }
    &__nav { flex-direction: row; flex-wrap: wrap; }
    &__topbar { justify-content: space-between; padding: 1rem; }
    &__content { padding: 1rem; }
  }
}
</style>
