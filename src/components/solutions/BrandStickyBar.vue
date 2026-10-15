<script setup>
import { useScrollHeader } from '@/composables/layout/useScrollHeader'

// Bar with the brands that stays at the top of the screen (BGSI-247),
// so the visitor can change brand without scrolling back up.
defineProps({
  brands: { type: Array, required: true },
  selectedId: { type: [Number, String], default: null },
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'show-all'])

// Same rules as the header: when the header hides, the bar goes up to the very top
const { isHidden: isHeaderHidden } = useScrollHeader()
</script>

<template>
  <nav
    class="brand-bar"
    :class="{ 'is-visible': visible, 'is-header-hidden': isHeaderHidden }"
    aria-label="Cambiar de marca"
    :aria-hidden="!visible"
  >
    <div class="container brand-bar__inner">
      <span class="brand-bar__label">Marcas</span>
      <button
        v-for="brand in brands"
        :key="brand.id"
        type="button"
        class="brand-bar__chip"
        :class="{ 'is-active': brand.id === selectedId }"
        :aria-pressed="brand.id === selectedId"
        :tabindex="visible ? 0 : -1"
        @click="emit('select', brand)"
      >
        {{ brand.name }}
      </button>
      <button type="button" class="brand-bar__all" :tabindex="visible ? 0 : -1" @click="emit('show-all')">
        ↑ Ver todas las marcas
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.brand-bar {
  position: fixed;
  top: 72px; // under the header
  right: 0;
  left: 0;
  z-index: 95; // under the header (100), over the demo tab (90)
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 14px rgba(11, 31, 58, 0.12);
  transform: translateY(-120%);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.3s ease, opacity 0.3s ease, top 0.3s ease;

  &.is-visible { transform: none; opacity: 1; pointer-events: auto; }
  &.is-header-hidden { top: 0; }

  &__inner {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
    overflow-x: auto; // mobile: slide the brands with the finger
    scrollbar-width: none;
  }

  &__label {
    margin-right: 0.25rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-muted);
    white-space: nowrap;
  }

  &__chip {
    padding: 0.45rem 1rem;
    border: 1px solid #d5dce6;
    border-radius: 999px;
    background: #fff;
    color: var(--color-navy);
    font: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;

    &:hover { border-color: var(--color-orange); }
    &.is-active { border-color: var(--color-orange); background: var(--color-orange); color: #fff; }
  }

  &__all {
    margin-left: auto;
    padding: 0;
    border: 0;
    background: none;
    color: var(--color-navy);
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
    white-space: nowrap;
    cursor: pointer;
  }
}

@media (max-width: 560px) {
  .brand-bar__label,
  .brand-bar__all { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .brand-bar { transition: none; }
}
</style>
