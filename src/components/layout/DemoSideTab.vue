<script setup>
import { RouterLink } from 'vue-router'

// Vertical orange tab on the right edge (BGSI-236).
// It tells the visitor there is a demo before they reach the orange card at the bottom.
defineProps({
  // true once the visitor reaches the orange "¿Quieres ver nuestros sistemas funcionando?" card
  hidden: { type: Boolean, default: false },
})
</script>

<template>
  <RouterLink
    :to="{ name: 'contact', query: { interes: 'demo' } }"
    class="demo-tab"
    :class="{ 'is-hidden': hidden }"
    :tabindex="hidden ? -1 : 0"
    :aria-hidden="hidden"
    aria-label="Solicita tu demo"
  >
    <svg class="demo-tab__icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4M7 12l3-3 2 2 4-4" />
    </svg>
    <span class="demo-tab__text">Demo</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.demo-tab {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 90; // under the header (100)
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 0.6rem;
  border-radius: 12px 0 0 12px;
  background: var(--color-orange);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-decoration: none;
  text-transform: uppercase;
  box-shadow: -4px 6px 18px rgba(0, 0, 0, 0.2);
  transform: translateY(-50%);
  transition: transform 0.35s ease, padding 0.2s ease, background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    padding-right: 0.9rem; // sticks out a little more
    background: var(--color-orange-dark);
  }

  // Slides out to the right once the orange card at the bottom is reached
  &.is-hidden {
    transform: translate(110%, -50%);
    pointer-events: none;
  }

  &__text {
    writing-mode: vertical-rl;
    transform: rotate(180deg); // reads from bottom to top
    font-size: 0.85rem;
  }
}

@media (max-width: 560px) {
  .demo-tab {
    padding: 0.75rem 0.45rem;
    gap: 0.45rem;

    &__icon { width: 16px; height: 16px; }
    &__text { font-size: 0.75rem; }
  }
}

@media (prefers-reduced-motion: reduce) {
  .demo-tab { transition: none; }
}
</style>
