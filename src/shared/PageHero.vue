<script setup>
import { RouterLink } from 'vue-router'

// Introduction band at the top of every public view (BGSI-212)
defineProps({
  breadcrumb: { type: String, required: true }, // name of the current page, e.g. "Nuestras Soluciones"
  eyebrow: { type: String, default: '' },       // small orange label above the title
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  centered: { type: Boolean, default: false },
})
</script>

<template>
  <section class="page-hero" :class="{ 'page-hero--centered': centered }">
    <div class="container page-hero__content">
      <nav class="page-hero__breadcrumb" aria-label="Migas de pan">
        <RouterLink to="/">Inicio</RouterLink>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{{ breadcrumb }}</span>
      </nav>

      <p v-if="eyebrow" class="page-hero__eyebrow">{{ eyebrow }}</p>
      <h1 class="page-hero__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-hero__subtitle">{{ subtitle }}</p>

      <!-- Optional extras of each view (a badge, a row of advantages...) -->
      <div v-if="$slots.default" class="page-hero__extra">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.page-hero {
  padding: 3.5rem 0 3rem;
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%);
  color: #fff;

  &__content { max-width: 1100px; }

  &__breadcrumb {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    font-size: 0.85rem;
    color: #cbd5e1;

    a { color: #cbd5e1; text-decoration: none; }
    a:hover { color: var(--color-orange); }
    [aria-current='page'] { color: #fff; }
  }

  // Orange dot + label
  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.75rem;
    padding: 0.3rem 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;

    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-orange);
    }
  }

  &__title { margin: 0 0 0.75rem; font-size: 2.4rem; line-height: 1.15; }
  &__subtitle { max-width: 720px; margin: 0; color: #dbe3ee; line-height: 1.6; }
  &__extra { margin-top: 1.75rem; }

  &--centered {
    text-align: center;

    .page-hero__breadcrumb { justify-content: center; }
    .page-hero__subtitle { margin: 0 auto; }
  }
}

@media (max-width: 560px) {
  .page-hero { padding: 2.5rem 0 2.25rem; }
  .page-hero__title { font-size: 1.9rem; }
}
</style>
