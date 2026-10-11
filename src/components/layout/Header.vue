<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import logoHeader from '@/assets/logo/logo_header.png'

const isHidden = ref(false)
const scrollThreshold = 100
let lastScrollY = 0

function handleScroll() {
  const currentScrollY = window.scrollY

  if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
    isHidden.value = true
  } else if (currentScrollY < lastScrollY) {
    isHidden.value = false
  }

  lastScrollY = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="header" :class="{ 'header--hidden': isHidden }">
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--color-navy, #1a2b4c);
  padding: 1rem 2rem;
  transition: transform 0.3s ease;
}

.header--hidden {
  transform: translateY(-100%);
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