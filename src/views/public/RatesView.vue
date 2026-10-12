<script setup>
import heroImage from '@/assets/images/hero.png'
import RateWizard from '@/components/rates/RateWizard.vue'
</script>

<template>
  <section class="rates">
    <!-- Blurred background image behind the wizard card (prototype) -->
    <div class="rates__background" :style="{ backgroundImage: `url(${heroImage})` }" aria-hidden="true"></div>

    <div class="container rates__content">
      <header class="rates__header">
        <h1>Calcula tu tarifa</h1>
        <p>Responde 5 preguntas rápidas y obtén un precio orientativo para tu negocio.</p>
      </header>

      <div class="rates__card">
        <RateWizard />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.rates {
  position: relative;
  overflow: hidden;
  padding: 4rem 0;

  &__background {
    position: absolute;
    inset: -20px; // hides the soft edges of the blur
    background-size: cover;
    background-position: center;
    filter: blur(8px) brightness(0.55);
  }

  &__content { position: relative; z-index: 1; }

  &__header {
    max-width: 720px;
    margin: 0 auto 2rem;
    text-align: center;
    color: #fff;

    h1 { margin: 0 0 0.75rem; }
    p { margin: 0; opacity: 0.9; }
  }

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
  .rates { padding: 2.5rem 0; }
  .rates__card { padding: 1.5rem 1rem; }
}
</style>
