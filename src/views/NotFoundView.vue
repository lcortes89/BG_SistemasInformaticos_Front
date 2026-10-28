<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="container not-found">
    <p class="not-found__code">404</p>
    <h1>Página no encontrada</h1>
    <p>La página que buscas no existe o ha cambiado de dirección.</p>
    <RouterLink to="/" class="btn btn--primary">Volver al inicio</RouterLink>
  </section>
</template>

<style scoped>
.not-found { padding: 4rem 16px; text-align: center; }
.not-found__code { font-size: 4rem; font-weight: 700; color: var(--color-orange); margin: 0; }
</style>
