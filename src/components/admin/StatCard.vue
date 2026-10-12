<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  label: { type: String, required: true },
  value: { type: Number, default: 0 },
  detail: { type: String, default: '' }, // e.g. "de 12 en total"
  icon: { type: String, default: '•' },
  to: { type: Object, default: null }, // route of the quick link
  linkLabel: { type: String, default: 'Ver' },
  isLoading: { type: Boolean, default: false },
})
</script>

<template>
  <article class="stat-card">
    <header class="stat-card__header">
      <h2 class="stat-card__label">{{ label }}</h2>
      <span class="stat-card__icon" aria-hidden="true">{{ icon }}</span>
    </header>

    <!-- BGSI-192: small spinner inside the card while the numbers arrive -->
    <p v-if="isLoading" class="stat-card__value" role="status" aria-label="Cargando">
      <span class="stat-card__spinner"></span>
    </p>
    <p v-else class="stat-card__value">{{ value }}</p>

    <footer class="stat-card__footer">
      <span>{{ detail }}</span>
      <RouterLink v-if="to" :to="to" class="stat-card__link">{{ linkLabel }} →</RouterLink>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 2px 10px rgba(11, 31, 58, 0.06);

  &__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; }

  &__label {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-muted);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
    color: var(--color-orange-dark);
    background: #ffedd5;
    border-radius: var(--radius);
  }

  &__value { display: flex; align-items: center; min-height: 3rem; margin: 0; font-size: 2.5rem; font-weight: 700; color: var(--color-navy); }

  &__spinner {
    width: 28px;
    height: 28px;
    border: 3px solid var(--color-bg-alt);
    border-top-color: var(--color-orange);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--color-muted);
  }

  &__link { font-weight: 600; color: var(--color-orange-dark); text-decoration: none; }
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
