<script setup>
defineProps({
  steps: { type: Array, required: true },
  current: { type: Number, required: true }, // index of the active step
})
</script>

<template>
  <ol class="stepper" aria-label="Progreso del cálculo">
    <li v-for="(step, index) in steps" :key="step.key" class="stepper__item"
        :class="{ 'is-active': index === current, 'is-done': index < current }"
        :aria-current="index === current ? 'step' : undefined">
      <span class="stepper__number">{{ index < current ? '✓' : index + 1 }}</span>
      <span class="stepper__title">{{ step.title }}</span>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.stepper {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0 0 2rem;
  padding: 0;
  list-style: none;
  counter-reset: none;

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    position: relative;
    color: var(--color-muted);
    font-size: 0.85rem;
    text-align: center;

    // Line between two steps
    &:not(:first-child)::before {
      content: '';
      position: absolute;
      top: 17px;
      right: 50%;
      width: 100%;
      height: 2px;
      background: #e5e7eb;
      z-index: 0;
    }
  }

  &__number {
    position: relative;
    z-index: 1;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #e5e7eb;
    color: var(--color-text);
    font-weight: 700;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .is-active { color: var(--color-orange); font-weight: 600; }
  .is-active .stepper__number { background: var(--color-orange); color: #fff; }
  .is-done .stepper__number { background: var(--color-navy); color: #fff; }
  .is-done::before, .is-active::before { background: var(--color-navy); }
}

// On mobile only the numbers are shown (the title is in "Paso X de 5")
@media (max-width: 560px) {
  .stepper__title { display: none; }
}
</style>
