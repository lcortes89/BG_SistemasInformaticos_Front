<script setup>
import { ref } from 'vue'

// Introduction band at the top of every public view (BGSI-212, BGSI-225)
defineProps({
  eyebrow: { type: String, default: '' }, // small orange label above the title
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  centered: { type: Boolean, default: false },
})

const hero = ref(null)

// The spotlight follows the cursor: we only store its position in two CSS variables
function moveSpotlight(event) {
  const box = hero.value.getBoundingClientRect()
  hero.value.style.setProperty('--spot-x', `${event.clientX - box.left}px`)
  hero.value.style.setProperty('--spot-y', `${event.clientY - box.top}px`)
}
</script>

<template>
  <section ref="hero" class="page-hero" :class="{ 'page-hero--centered': centered }" @mousemove="moveSpotlight">
    <!-- Decorative layers: dot grid, light that drifts by itself, spotlight under the cursor -->
    <div class="page-hero__dots" aria-hidden="true"></div>
    <div class="page-hero__drift" aria-hidden="true"></div>
    <div class="page-hero__spot" aria-hidden="true"></div>

    <div class="container page-hero__content">
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
  position: relative;
  overflow: hidden;
  padding: 3.5rem 0 3rem;
  background: #0d2445;
  color: #fff;

  // Subtle grid of dots (prototype)
  &__dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1.4px);
    background-size: 18px 18px;
  }

  // Round light that moves slowly from side to side
  &__drift {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 520px;
    height: 520px;
    margin: -260px 0 0 -260px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(90, 140, 230, 0.5), transparent 65%);
    animation: page-hero-drift 9s ease-in-out infinite alternate;
    transition: opacity 0.4s ease;
  }

  // Light that follows the cursor (only while hovering)
  &__spot {
    position: absolute;
    inset: 0;
    opacity: 0;
    background: radial-gradient(circle 180px at var(--spot-x, 50%) var(--spot-y, 50%),
      rgba(120, 170, 255, 0.45), rgba(60, 110, 200, 0.15) 45%, transparent 70%);
    transition: opacity 0.4s ease;
  }

  &:hover &__drift { animation-play-state: paused; opacity: 0.35; }
  &:hover &__spot { opacity: 1; }

  &__content { position: relative; z-index: 1; max-width: 1100px; }

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

    .page-hero__subtitle { margin: 0 auto; }
  }
}

@keyframes page-hero-drift {
  0% { transform: translate(-280px, -30px); }
  50% { transform: translate(40px, 40px); }
  100% { transform: translate(300px, -20px); }
}

@media (max-width: 560px) {
  .page-hero { padding: 2.5rem 0 2.25rem; }
  .page-hero__title { font-size: 1.9rem; }
}

// Without animations the light stays still in the centre
@media (prefers-reduced-motion: reduce) {
  .page-hero__drift { animation: none; }
  .page-hero__spot, .page-hero__drift { transition: none; }
}
</style>
