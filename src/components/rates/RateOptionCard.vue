<script setup>
defineProps({
  option: { type: Object, required: true }, // { code, icon, label, description }
  selected: { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<template>
  <button type="button" class="option" :class="{ 'is-selected': selected }"
          role="radio" :aria-checked="selected" @click="$emit('select', option.code)">
    <span class="option__icon" aria-hidden="true">{{ option.icon }}</span>
    <span class="option__label">{{ option.label }}</span>
    <span class="option__description">{{ option.description }}</span>
  </button>
</template>

<style scoped lang="scss">
.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  padding: 1.25rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: var(--radius);
  background: #fff;
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover { border-color: var(--color-orange); transform: translateY(-2px); }
  &:focus-visible { outline: 3px solid var(--color-orange); outline-offset: 2px; }

  &.is-selected {
    border-color: var(--color-orange);
    background: #fff7ef;
    box-shadow: 0 4px 14px rgba(242, 140, 40, 0.25);
  }

  &__icon { font-size: 2rem; line-height: 1; }
  &__label { font-weight: 700; color: var(--color-navy); }
  &__description { font-size: 0.85rem; color: var(--color-muted); }
}

@media (prefers-reduced-motion: reduce) {
  .option, .option:hover { transition: none; transform: none; }
}

// BGSI-330: one row per option on mobile (option A): icon on the left, text and description on the right
@media (max-width: 560px) {
  .option {
    display: grid;
    grid-template-columns: 2.25rem minmax(0, 1fr);
    grid-template-areas:
      "icon label"
      "icon description";
    align-items: center;
    gap: 0.1rem 0.75rem;
    padding: 0.7rem 0.9rem;
    text-align: left;

    &:hover { transform: none; }
    &__icon { grid-area: icon; font-size: 1.5rem; text-align: center; }
    &__label { grid-area: label; font-size: 0.95rem; }
    &__description { grid-area: description; font-size: 0.8rem; line-height: 1.35; }
  }
}
</style>
