<script setup>
import AdminLoginForm from '@/components/admin/AdminLoginForm.vue'
</script>

<template>
  <section class="admin-login">
    <div class="admin-login__card">
      <h1>Acceso administración</h1>
      <p>Introduce tus credenciales para gestionar la web.</p>
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
    p { margin: 0 0 2rem; color: var(--color-muted); }
  }
}
</style>
