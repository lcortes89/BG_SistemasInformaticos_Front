<script setup>
// BGSI-314: the three pages of "Ajustes de perfil" (Cambiar contraseña, Cambiar email, Verificación en dos pasos)
// share this layout: title, the card of the setting and the "Ten en cuenta" box with its tips
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>{{ title }}</h1>
        <p><slot name="subtitle" /></p>
      </div>
    </header>

    <slot name="feedback" />

    <div class="account-page">
      <div class="account-page__card">
        <slot />
      </div>

      <aside class="account-page__info">
        <h2 class="account-page__title">Ten en cuenta</h2>
        <slot name="info" />
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.account-page {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  max-width: 1000px;
  gap: 1.5rem;
  align-items: start;

  &__card,
  &__info {
    padding: 1.75rem;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(11, 31, 58, 0.08);
  }

  &__info {
    background: var(--color-navy);
    color: #e3eaf4;

    :deep(ul) { margin: 0; padding-left: 1.1rem; line-height: 1.6; }
    :deep(li + li) { margin-top: 0.5rem; }
    :deep(strong) { color: #fff; }
    :deep(a) { color: #fff; font-weight: 600; }
  }

  &__title { margin: 0 0 1.25rem; font-size: 1.15rem; color: #fff; }
}

@media (max-width: 900px) {
  .account-page { grid-template-columns: 1fr; }
}
</style>
