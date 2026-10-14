<script setup>
import heroImage from '@/assets/images/hero.png'
import PageHero from '@/shared/PageHero.vue'
import RateWizard from '@/components/rates/RateWizard.vue'
import RatesFaq from '@/components/rates/RatesFaq.vue'
import { RATE_FAQ } from '@/core/models/rate/rate-faq'
</script>

<template>
  <PageHero
    eyebrow="Calculador inteligente de soluciones"
    title="Calcula tu tarifa"
    subtitle="Respóndenos unas preguntas sobre tu negocio y te ayudamos a encontrar la solución tecnológica y la tarifa mensual que mejor se ajusta a tus necesidades."
  />

  <section class="rates">
    <!-- Blurred background image behind the wizard card (prototype) -->
    <div class="rates__background" :style="{ backgroundImage: `url(${heroImage})` }" aria-hidden="true"></div>

    <div class="container rates__content">
      <div class="rates__card">
        <RateWizard />
      </div>
    </div>
  </section>

  <!-- BGSI-224: the FAQ lives outside the blurred block -->
  <RatesFaq :items="RATE_FAQ" />
</template>

<style scoped lang="scss">
.rates {
  position: relative;
  overflow: hidden;
  padding: 3rem 0;

  &__background {
    position: absolute;
    inset: -20px; // hides the soft edges of the blur
    background-size: cover;
    background-position: center;
    filter: blur(8px) brightness(0.55);
  }

  &__content { position: relative; z-index: 1; }

  &__card {
    max-width: 900px;
    margin: 0 auto;
    padding: 2.5rem;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  }
}

@media (max-width: 560px) {
  .rates { padding: 2rem 0; }
  .rates__card { padding: 1.5rem 1rem; }
}
</style>
