<script setup>
import logoHeader from '@/assets/logo/logo_header.png'
</script>

<template>
  <header class="header">
    <div class="header__container">
      <RouterLink to="/" class="header__logo-link">
        <img :src="logoHeader" alt="BG Sistemas Informáticos" class="header__logo" />
      </RouterLink>

      <nav class="header__nav">
        <RouterLink to="/soluciones" class="header__nav-link">Soluciones</RouterLink>
        <RouterLink to="/tarifas" class="header__nav-link">Tarifas</RouterLink>
        <RouterLink to="/clientes" class="header__nav-link">Nuestros Clientes</RouterLink>
      </nav>

      <RouterLink to="/contacto" class="header__cta">Contacto</RouterLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-navy, #1a2b4c);
  padding: 1rem 2rem;
}

.header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.header__logo {
  height: 40px;
}

.header__nav {
  display: flex;
  gap: 2rem;
}

.header__nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
}

.header__nav-link:hover {
  color: var(--color-orange, #e8792a);
}

.header__cta {
  background-color: var(--color-orange, #e8792a);
  color: #ffffff;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
}
</style>