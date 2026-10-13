<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import logo from '@/assets/logo/logo_header.png'
import { useScrollHeader } from '@/composables/layout/useScrollHeader'

const links = [
  { to: '/soluciones', label: 'Soluciones' },
  { to: '/tarifas', label: 'Tarifas' },
  { to: '/clientes', label: 'Nuestros Clientes' },
]

// Mobile menu: closed by default
const isMenuOpen = ref(false)

// Smart header: translucent when scrolling, hidden going down, back when going up
const { isTranslucent, isHidden, isAtTop } = useScrollHeader()

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="app-header"
          :class="{ 'is-translucent': isTranslucent, 'is-hidden': isHidden && !isMenuOpen, 'is-at-top': isAtTop }">
    <div class="container app-header__inner">
      <RouterLink to="/" class="app-header__brand" @click="closeMenu">
        <img :src="logo" alt="BG Sistemas Informáticos" class="app-header__logo" />
      </RouterLink>

      <button
        type="button"
        class="app-header__toggle"
        data-test="menu-toggle"
        aria-controls="main-nav"
        :aria-expanded="isMenuOpen"
        aria-label="Abrir o cerrar el menú"
        @click="toggleMenu"
      >
        <span></span><span></span><span></span>
      </button>

      <nav id="main-nav" class="app-header__nav" :class="{ 'is-open': isMenuOpen }" aria-label="Navegación principal">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="app-header__link" @click="closeMenu">
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/contacto" class="btn btn--primary" @click="closeMenu">Contacto</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-navy);
  transition: transform 0.3s ease, background-color 0.3s ease;

  // BGSI-210: semi-transparent navy with the page blurred behind it
  &.is-translucent {
    background: rgba(11, 31, 58, 0.82);
    backdrop-filter: blur(8px);
  }

  // BGSI-210: slides up out of the screen
  &.is-hidden {
    transform: translateY(-100%);
  }

  // Back at the top of the page: appear at once (no white line under the header)
  &.is-at-top {
    transition: none;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 72px;
  }

  &__logo {
    display: block;
    width: auto;
    height: 48px;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  &__link {
    color: #fff;
    font-weight: 500;
    text-decoration: none;

    &:hover,
    &.router-link-active {
      color: var(--color-orange);
    }
  }

  &__toggle {
    display: none;
    padding: 8px;
    background: none;
    border: 0;
    cursor: pointer;

    span {
      display: block;
      width: 24px;
      height: 2px;
      margin: 5px 0;
      background: #fff;
    }
  }
}

@media (max-width: 768px) {
  .app-header__toggle {
    display: block;
  }

  .app-header__nav {
    display: none;
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 16px 1.5rem;
    background: var(--color-navy);

    &.is-open {
      display: flex;
      animation: slide-fade-in 0.3s ease-out;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-header {
    transition: none;
  }

  .app-header__nav.is-open {
    animation: none;
  }
}
</style>
