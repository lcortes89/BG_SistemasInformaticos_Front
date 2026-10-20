<script setup>
// White card in the middle of the page: login, forgot password and new password (BGSI-273)
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <section class="auth-page">
    <div class="auth-page__card">
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="auth-page__subtitle">{{ subtitle }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.auth-page {
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
  }

  &__subtitle { margin: 0 0 2rem; color: var(--color-muted); }
}
</style>
