<script setup>
// Grey "skeleton" card shown while the real cards load (BGSI-243).
// It has the same shape as the real card, so nothing jumps when the data arrives.
defineProps({
  // brand = BrandCard · product = ProductDetailCard · client = logo + name (BGSI-244)
  variant: {
    type: String,
    default: 'brand',
    validator: (value) => ['brand', 'product', 'client'].includes(value),
  },
})
</script>

<template>
  <div class="skeleton" :class="`skeleton--${variant}`" aria-hidden="true">
    <template v-if="variant === 'brand'">
      <span class="skeleton__block skeleton__badge"></span>
      <span class="skeleton__block skeleton__line" style="width: 55%"></span>
      <span class="skeleton__block skeleton__line skeleton__line--title" style="width: 70%"></span>
      <span class="skeleton__block skeleton__line"></span>
      <span class="skeleton__block skeleton__line" style="width: 85%"></span>
      <span class="skeleton__block skeleton__button"></span>
    </template>

    <template v-else-if="variant === 'product'">
      <span class="skeleton__block skeleton__media"></span>
      <div class="skeleton__body">
        <span class="skeleton__block skeleton__line" style="width: 20%"></span>
        <span class="skeleton__block skeleton__line skeleton__line--title" style="width: 45%"></span>
        <span class="skeleton__block skeleton__line"></span>
        <span class="skeleton__block skeleton__line" style="width: 90%"></span>
        <span class="skeleton__block skeleton__line" style="width: 70%"></span>
        <span class="skeleton__block skeleton__button"></span>
      </div>
    </template>

    <template v-else>
      <span class="skeleton__block skeleton__logo"></span>
      <span class="skeleton__block skeleton__line" style="width: 65%"></span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 4px 16px rgba(11, 31, 58, 0.08);

  // Grey block with a white shine that crosses it from left to right
  &__block {
    position: relative;
    display: block;
    overflow: hidden;
    border-radius: 6px;
    background: #e6eaf0;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent);
      animation: skeleton-shine 1.4s infinite;
    }
  }

  &__line { width: 100%; height: 12px; }
  &__line--title { height: 20px; }
  &__badge { width: 48px; height: 48px; border-radius: 50%; }
  &__button { width: 130px; height: 40px; margin-top: 0.5rem; border-radius: 8px; }

  // Product sheet: image on the left, text on the right
  &--product {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    gap: 0;
    padding: 0;
    overflow: hidden;
  }

  &__media { min-height: 260px; border-radius: 0; }
  &__body { display: flex; flex-direction: column; gap: 0.8rem; padding: 1.75rem 2rem; }

  // Client: round logo + name, centred
  &--client { align-items: center; padding: 1.75rem 1rem; }
  &__logo { width: 72px; height: 72px; border-radius: 50%; }
}

@keyframes skeleton-shine {
  to { transform: translateX(100%); }
}

@media (max-width: 760px) {
  .skeleton--product { grid-template-columns: minmax(0, 1fr); }
  .skeleton__media { min-height: 200px; }
  .skeleton__body { padding: 1.25rem; }
}

// Users who ask for less motion get the grey cards without the shine
@media (prefers-reduced-motion: reduce) {
  .skeleton__block::after { animation: none; }
}
</style>
