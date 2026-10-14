<script setup>
// Introduction band at the top of every public view (BGSI-212, BGSI-225)
defineProps({
  eyebrow: { type: String, default: '' }, // small orange label above the title
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  centered: { type: Boolean, default: false },
})
</script>

<template>
  <section class="page-hero" :class="{ 'page-hero--centered': centered }">
    <!-- Decorative layers: sparse dot grid and two wide lights that "breathe" slowly -->
    <div class="page-hero__dots" aria-hidden="true"></div>
    <div class="page-hero__light page-hero__light--blue" aria-hidden="true"></div>
    <div class="page-hero__light page-hero__light--warm" aria-hidden="true"></div>

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
  // 72px = the transparent header floating on top
  padding: calc(72px + 3rem) 0 3.5rem;
  background: #123461;
  color: #fff;

  // Sparse grid of dots
  &__dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1.5px);
    background-size: 34px 34px;
  }

  // Two wide lights that grow and shrink very slowly
  &__light {
    position: absolute;
    border-radius: 50%;
    animation: page-hero-breathe 12s ease-in-out infinite alternate;

    &--blue {
      top: -320px;
      right: -180px;
      width: 680px;
      height: 680px;
      background: radial-gradient(circle, rgba(130, 180, 255, 0.55), rgba(90, 140, 230, 0.18) 45%, transparent 70%);
    }

    &--warm {
      bottom: -360px;
      left: 18%;
      width: 620px;
      height: 620px;
      background: radial-gradient(circle, rgba(242, 140, 40, 0.38), rgba(242, 140, 40, 0.12) 45%, transparent 70%);
      animation-delay: -6s;
    }
  }

  &__content { position: relative; z-index: 1; max-width: 1100px; }

  // Orange dot + label
  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.75rem;
    padding: 0.3rem 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.25);
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
  &__subtitle { max-width: 720px; margin: 0; color: #e3eaf4; line-height: 1.6; }
  &__extra { margin-top: 1.75rem; }

  &--centered {
    text-align: center;

    .page-hero__subtitle { margin: 0 auto; }
  }
}

@keyframes page-hero-breathe {
  from { transform: scale(0.9); opacity: 0.85; }
  to { transform: scale(1.12); opacity: 1; }
}

@media (max-width: 560px) {
  .page-hero { padding: calc(72px + 2rem) 0 2.5rem; }
  .page-hero__title { font-size: 1.9rem; }
}

// Without animations the lights stay still
@media (prefers-reduced-motion: reduce) {
  .page-hero__light { animation: none; }
}
</style>
