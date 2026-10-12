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
</style>
