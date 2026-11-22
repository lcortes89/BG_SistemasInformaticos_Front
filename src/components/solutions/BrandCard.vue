<script setup>
const props = defineProps({
  brand: { type: Object, required: true },
  active: { type: Boolean, default: false },
})

// Tells the parent "this brand was chosen"
const emit = defineEmits(['select'])

function choose() {
  emit('select', props.brand)
}
</script>

<template>
  <article class="brand-card" :class="{ 'brand-card--active': active }">
    <span class="brand-card__badge" aria-hidden="true">{{ brand.getInitials() }}</span>
    <p class="brand-card__category">{{ brand.category }}</p>
    <h3 class="brand-card__name">{{ brand.name }}</h3>
    <p class="brand-card__description">{{ brand.description }}</p>
    <button type="button" class="btn btn--primary brand-card__button" :aria-pressed="active" @click="choose">
      Ver productos
    </button>
  </article>
</template>

<style scoped lang="scss">
.brand-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: #fff;
  border: 2px solid transparent;
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(11, 31, 58, 0.08);
  transition: border-color 0.2s;

  &--active { border-color: var(--color-orange); }

  &__badge {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    font-weight: 700;
    color: #fff;
    background: var(--color-navy);
    border-radius: 50%;
  }

  &__category {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--color-orange-dark);
  }

  &__name { margin: 0; color: var(--color-navy); }
  &__description { flex: 1; margin: 0; color: var(--color-muted); }
  &__button { align-self: flex-start; margin-top: 0.5rem; }
}

// BGSI-330: one row per brand on mobile (option A). Desktop and tablet do not change
@media (max-width: 560px) {
  .brand-card {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "badge category button"
      "badge name     button";
    align-items: center;
    gap: 0.1rem 0.75rem;
    padding: 0.75rem 1rem;

    &__badge { grid-area: badge; width: 40px; height: 40px; font-size: 0.85rem; }
    &__category { grid-area: category; align-self: end; font-size: 0.7rem; }
    &__name { grid-area: name; align-self: start; font-size: 1rem; }
    &__description { display: none; }
    &__button { grid-area: button; margin: 0; padding: 0.45rem 0.8rem; font-size: 0.8rem; white-space: nowrap; }
  }
}
</style>
