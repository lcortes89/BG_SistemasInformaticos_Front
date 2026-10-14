<script setup>
import heroImage from '@/assets/images/hero.png'
import PageHero from '@/shared/PageHero.vue'
import RateWizard from '@/components/rates/RateWizard.vue'
import RatesFaq from '@/components/rates/RatesFaq.vue'
import { RATE_FAQ } from '@/core/models/rate/rate-faq'
</script>

<template>
  <!-- BGSI-226: hero and wizard share one background: navy at the top that fades into the photo -->
  <div class="rates-top">
    <div class="rates-top__image" :style="{ backgroundImage: `url(${heroImage})` }" aria-hidden="true"></div>
    <div class="rates-top__fade" aria-hidden="true"></div>

    <PageHero
      transparent
      eyebrow="Calculador inteligente de soluciones"
      title="Calcula tu tarifa"
      subtitle="Respóndenos unas preguntas sobre tu negocio y te ayudamos a encontrar la solución tecnológica y la tarifa mensual que mejor se ajusta a tus necesidades."
    />

    <section class="rates">
      <div class="container">
        <div class="rates__card">
          <RateWizard />
        </div>
      </div>
    </section>
  </div>

  <!-- BGSI-224: the FAQ lives outside the photo block -->
  <RatesFaq :items="RATE_FAQ" />
</template>

<style scoped lang="scss">
.rates-top {
  position: relative;
  overflow: hidden;

  // Blurred photo of a restaurant, lighter than before
  &__image {
    position: absolute;
    inset: -20px; // hides the soft edges of the blur
    background-size: cover;
    background-position: center;
    filter: blur(8px) brightness(0.95) saturate(1.05);
  }

  // Navy behind the title that becomes transparent and ends in a white veil
  &__fade {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom,
      #123461 0,
      #123461 170px,
      rgba(30, 74, 130, 0.7) 290px,
      rgba(70, 120, 190, 0.35) 395px,
      rgba(170, 205, 245, 0.3) 470px,
      rgba(235, 242, 252, 0.45) 610px,
      rgba(245, 248, 252, 0.55) 100%);
  }
}

.rates {
  position: relative;
  z-index: 1;
  padding: 1rem 0 3rem;

  &__card {
    max-width: 900px;
    margin: 0 auto;
    padding: 2.5rem;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  }
}

// On mobile the text takes more lines: the navy goes further down
@media (max-width: 560px) {
  .rates-top__fade {
    background: linear-gradient(to bottom,
      #123461 0,
      #123461 330px,
      rgba(30, 74, 130, 0.7) 430px,
      rgba(70, 120, 190, 0.35) 520px,
      rgba(170, 205, 245, 0.3) 590px,
      rgba(245, 248, 252, 0.55) 100%);
  }

  .rates { padding: 0.5rem 0 2rem; }
  .rates__card { padding: 1.5rem 1rem; }
}
</style>
