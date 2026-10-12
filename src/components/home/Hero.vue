<script setup>
import heroImage from '@/assets/images/hero.png'
</script>

<template>
  <section class="hero" :style="{ backgroundImage: `url(${heroImage})` }">
    <div class="hero__overlay"></div>
    <div class="hero__content">
      <h1 class="hero__title">Digitaliza tu negocio hostelero</h1>
      <p class="hero__subtitle">
        Empresa especializada en el sector hostelero con la cual puedes transformar tu
        restaurante o PYME con sistemas inteligentes que optimizan cada proceso y mejoran
        la experiencia de tus clientes
      </p>
      <RouterLink to="/soluciones" class="hero__cta">Ver Soluciones</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 0 2rem;
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
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero__cta {
  display: inline-block;
  background-color: var(--color-orange, #e8792a);
  color: #ffffff;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
}
</style>