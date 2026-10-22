<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useConfirmationStore } from '@/stores/confirmation'
import { useIdleLogout } from '@/composables/admin/useIdleLogout'
import { useMobileMenu } from '@/composables/layout/useMobileMenu'
import { ADMIN_HOME, ADMIN_MENU, groupOf } from '@/core/config/admin-menu'
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

// BGSI-297: only the title of each group is shown; clicking it shows its pages (one group open at a time)
const route = useRoute()
const openGroup = ref(null)

function toggleGroup(title) {
  openGroup.value = openGroup.value === title ? null : title
}

// The group of the page you are on is always open
watch(() => route.name, (name) => {
  openGroup.value = groupOf(name) ?? openGroup.value
}, { immediate: true })

// BGSI-298: on mobile the menu is behind the ☰ button (Esc, a tap outside or a new page close it)
const sidebar = ref(null)
const { isOpen: isMenuOpen, toggle: toggleMenu } = useMobileMenu(sidebar)

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
    <aside ref="sidebar" class="admin-layout__sidebar">
      <div class="admin-layout__brand">
        <img :src="logo" alt="BG Sistemas Informáticos" class="admin-layout__logo" />
        <button type="button" class="admin-layout__burger" data-test="admin-menu-toggle" :aria-expanded="isMenuOpen"
                aria-controls="admin-nav" :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'" @click="toggleMenu">
          <span /><span /><span />
        </button>
      </div>
      <nav id="admin-nav" class="admin-layout__nav" :class="{ 'admin-layout__nav--open': isMenuOpen }"
           aria-label="Navegación de administración">
        <RouterLink :to="ADMIN_HOME.to" class="admin-layout__group-title admin-layout__home"
                    exact-active-class="admin-layout__home--active">
          <span class="admin-layout__emoji" aria-hidden="true">{{ ADMIN_HOME.icon }}</span>
          <span class="admin-layout__label">{{ ADMIN_HOME.label }}</span>
        </RouterLink>
        <section v-for="group in ADMIN_MENU" :key="group.title" class="admin-layout__group"
                 :class="{ 'admin-layout__group--open': openGroup === group.title }">
          <button type="button" class="admin-layout__group-title" :aria-expanded="openGroup === group.title"
                  :aria-controls="`admin-group-${group.links[0].to.name}`" @click="toggleGroup(group.title)">
            <span class="admin-layout__emoji" aria-hidden="true">{{ group.icon }}</span>
            <span class="admin-layout__label">{{ group.title }}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" class="admin-layout__chevron"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          <div v-show="openGroup === group.title" :id="`admin-group-${group.links[0].to.name}`"
               class="admin-layout__group-links">
            <RouterLink v-for="link in group.links" :key="link.label" :to="link.to" class="admin-layout__link"
                        exact-active-class="admin-layout__link--active">
              {{ link.label }}
            </RouterLink>
          </div>
        </section>

        <!-- BGSI-298: on mobile the session goes inside the menu (on desktop it is in the top bar) -->
        <div class="admin-layout__session">
          <span>Sesión iniciada como <strong>{{ authStore.email }}</strong></span>
          <button type="button" class="btn btn--primary admin-layout__logout" @click="logout">Cerrar sesión</button>
        </div>
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
  grid-template-columns: 320px 1fr;
  min-height: 100vh;

  &__sidebar {
    padding: 1.5rem 1rem;
    background: var(--color-navy);
  }

  &__brand { display: flex; align-items: center; justify-content: space-between; margin: 0 0 1.5rem 0.5rem; }

  &__logo { display: block; height: 48px; }

  &__burger { display: none; }

  &__nav { display: flex; flex-direction: column; gap: 0.35rem; }

  &__group { display: flex; flex-direction: column; }

  &__group-title {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    padding: 0.7rem 0.9rem;
    font: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    color: #fff;
    text-align: left;
    white-space: nowrap;
    background: transparent;
    border: 0;
    border-radius: var(--radius);
    cursor: pointer;

    &:hover { background: var(--color-navy-light); }
  }

  &__group--open &__group-title { background: var(--color-navy-light); }

  &__home { text-decoration: none; }
  &__home--active, &__home--active:hover { color: var(--color-navy); background: var(--color-orange); }

  &__chevron {
    flex: none;
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0.7;
    transition: transform 0.2s;
  }

  &__group--open &__chevron { transform: rotate(90deg); }

  &__group-links {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    margin: 0.3rem 0 0.4rem 1.45rem;
    padding-left: 0.6rem;
    border-left: 1px solid rgba(255, 255, 255, 0.15);
  }

  &__label { flex: 1; }

  &__session { display: none; }

  &__emoji { flex: none; width: 1.3rem; font-size: 1.05rem; line-height: 1; text-align: center; }

  &__link {
    padding: 0.5rem 0.8rem;
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
    grid-template-rows: auto 1fr;

    &__sidebar { position: sticky; top: 0; z-index: 20; padding: 0.75rem 1rem; }
    &__brand { margin: 0; }
    &__logo { height: 40px; }

    &__burger {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 44px;
      height: 44px;
      padding: 0 11px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: var(--radius);
      cursor: pointer;

      span { display: block; height: 2px; background: #fff; border-radius: 2px; transition: transform 0.2s, opacity 0.2s; }

      &[aria-expanded='true'] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      &[aria-expanded='true'] span:nth-child(2) { opacity: 0; }
      &[aria-expanded='true'] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    }

    &__nav { display: none; max-height: calc(100vh - 68px); overflow-y: auto; padding-top: 1rem; }
    &__nav--open { display: flex; }

    &__session {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      margin-top: 0.5rem;
      padding: 1rem 0.9rem 0.5rem;
      color: rgba(255, 255, 255, 0.8);
      border-top: 1px solid rgba(255, 255, 255, 0.15);

      strong { color: #fff; word-break: break-all; }
    }

    // The session is inside the menu: the top bar is not needed
    &__topbar { display: none; }
    &__content { padding: 1rem; }
  }
}
</style>
