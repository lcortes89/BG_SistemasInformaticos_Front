<script setup>
import heroImage from '@/assets/images/hero.png'
</script>

<template>
  <section class="hero" :style="{ backgroundImage: `url(${heroImage})` }">
    <div class="hero__overlay"></div>
    <div class="hero__content">
      <h1 class="hero__title">Digitaliza tu negocio hostelero</h1>
      <p class="hero__subtitle">
        Transformamos la gestión de tu restaurante o PYME con sistemas inteligentes que optimizan
        cada proceso y mejoran la experiencia de tus clientes.
      </p>
    </div>
  </section>
</template>

<style scoped>
/* BGSI-211: lower than before (it used to fill the whole screen) */
.hero {
  position: relative;
  min-height: calc(min(70vh, 620px) + 72px);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: calc(72px + 4rem) 2rem 4rem;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background-color: var(--color-navy, #1a2b4c);
  opacity: 0.6;
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  color: #ffffff;
}

.hero__title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.hero__subtitle {
  font-size: 1.1rem;
  margin-bottom: 0;
  line-height: 1.6;
}

@media (max-width: 560px) {
  .hero { min-height: 0; padding: calc(72px + 3rem) 1rem 3.5rem; }
  .hero__title { font-size: 2rem; }
}
</style>
