<script setup>
import PageHero from '@/shared/PageHero.vue'
import PageBackdrop from '@/shared/PageBackdrop.vue'
import RateWizard from '@/components/rates/RateWizard.vue'
import RatesFaq from '@/components/rates/RatesFaq.vue'
import { RATE_FAQ } from '@/core/models/rate/rate-faq'
</script>

<template>
  <PageBackdrop>
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
  </PageBackdrop>

  <!-- BGSI-224: the FAQ lives outside the photo block -->
  <RatesFaq :items="RATE_FAQ" />
</template>

<style scoped lang="scss">
.rates {
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

@media (max-width: 560px) {
  .rates { padding: 0.5rem 0 2rem; }
  .rates__card { padding: 1.5rem 1rem; }
}
</style>
