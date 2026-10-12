<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <section class="container admin-dashboard">
    <header class="admin-dashboard__header">
      <div>
        <h1>Panel de administración</h1>
        <p>Sesión iniciada como <strong>{{ authStore.email }}</strong></p>
      </div>
      <button type="button" class="btn btn--primary" @click="logout">Cerrar sesión</button>
    </header>
    <p>El dashboard se construye en el sprint 3.</p>
  </section>
</template>

<style scoped lang="scss">
.admin-dashboard {
  padding: 3rem 16px;

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;

    h1 { margin: 0 0 0.25rem; color: var(--color-navy); }
    p { margin: 0; color: var(--color-muted); }
  }
}
</style>
