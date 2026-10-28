<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <!-- Orange card that sits half over the page and half over the footer (BGSI-221) -->
  <section class="demo-cta" aria-labelledby="demo-cta-title">
    <div class="container">
      <div class="demo-cta__card">
        <span class="demo-cta__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M8 20h8M12 16v4M7 12l3-3 2 2 4-4" />
          </svg>
        </span>

        <div class="demo-cta__text">
          <h2 id="demo-cta-title" class="demo-cta__title">¿Quieres ver nuestros sistemas funcionando?</h2>
          <p class="demo-cta__subtitle">Solicita tu demo y te lo mostramos en 30 minutos.</p>
        </div>

        <RouterLink :to="{ name: 'contact', query: { interes: 'demo' } }" class="demo-cta__button">
          Solicita tu demo
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.demo-cta {
  position: relative;
  z-index: 1;
  padding-top: 2rem;
  // White that melts into the navy of the footer behind the card (BGSI-227)
  background: linear-gradient(to bottom,
    rgba(11, 31, 58, 0) 0%,
    rgba(11, 31, 58, 0.25) 30%,
    rgba(11, 31, 58, 0.85) 55%,
    var(--color-navy) 70%);

  &__card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.75rem 2rem;
    border-radius: 16px;
    background: var(--color-orange);
    color: #fff;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  }

  &__icon {
    flex-shrink: 0;
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #fff;
    color: var(--color-orange);
  }

  &__text { flex: 1; }
  &__title { margin: 0; font-size: 1.3rem; color: #fff; }
  &__subtitle { margin: 0.25rem 0 0; color: #fff3e6; }

  &__button {
    flex-shrink: 0;
    padding: 0.85rem 1.5rem;
    border-radius: var(--radius);
    background: #fff;
    color: var(--color-orange-dark);
    font-weight: 700;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); }
    &:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
  }
}

@media (max-width: 700px) {
  .demo-cta__card { flex-direction: column; text-align: center; padding: 1.5rem; }
  .demo-cta__button { width: 100%; text-align: center; }
}

@media (prefers-reduced-motion: reduce) {
  .demo-cta__button, .demo-cta__button:hover { transition: none; transform: none; }
}
</style>
