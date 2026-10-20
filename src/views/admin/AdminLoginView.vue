<script setup>
import { useRoute } from 'vue-router'
import AdminLoginForm from '@/components/admin/AdminLoginForm.vue'

const route = useRoute()
</script>

<template>
  <section class="admin-login">
    <div class="admin-login__card">
      <h1>Acceso administración</h1>
      <p>Introduce tus credenciales para gestionar la web.</p>
      <Transition name="slide-fade" appear>
        <p v-if="route.query.expired" class="admin-login__notice" role="status">
          Tu sesión ha caducado. Vuelve a iniciar sesión.
        </p>
        <p v-else-if="route.query.loggedOut" class="admin-login__notice" role="status">
          Se ha cerrado la sesión desde otra pestaña.
        </p>
        <p v-else-if="route.query.reset" class="admin-login__notice admin-login__notice--ok" role="status">
          Contraseña cambiada. Ya puedes entrar con la nueva.
        </p>
      </Transition>
      <AdminLoginForm />
    </div>
  </section>
</template>

<style scoped lang="scss">
.admin-login {
  display: flex;
  justify-content: center;
  padding: 4rem 16px;
  background: var(--color-bg-alt);

  &__card {
    width: 100%;
    max-width: 420px;
    padding: 2.5rem 2rem;
    background: #fff;
    border-radius: var(--radius);
    box-shadow: 0 4px 20px rgba(11, 31, 58, 0.08);

    h1 { margin: 0 0 0.5rem; font-size: 1.6rem; color: var(--color-navy); }
    > p { margin: 0 0 2rem; color: var(--color-muted); }
  }

  &__notice {
    margin: -1rem 0 1.5rem !important;
    padding: 0.9rem 1rem;
    border-radius: var(--radius);
    color: #78350f !important;
    background: #fef3c7;

    // BGSI-273: green notice after creating a new password
    &--ok { color: #065f46 !important; background: #ecfdf5; }
  }
}
</style>
