<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logo from '@/assets/logo/logo_header.png'

const authStore = useAuthStore()
const router = useRouter()

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
  authStore.logout()
  router.push({ name: 'admin-login' })
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
