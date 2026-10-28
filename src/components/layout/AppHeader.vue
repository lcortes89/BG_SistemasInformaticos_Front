<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import logo from '@/assets/logo/logo_header.png'
import { useScrollHeader } from '@/composables/layout/useScrollHeader'
import { useMobileMenu } from '@/composables/layout/useMobileMenu'

defineProps({
  // true on pages with a hero: transparent at the top of the page
  overlay: { type: Boolean, default: false },
  // false on the admin login (BGSI-256): same header, without the public menu
  showNav: { type: Boolean, default: true },
})

const links = [
  { to: '/', label: 'Inicio' }, // BGSI-263: not everybody knows that the logo goes home
  { to: '/soluciones', label: 'Soluciones' },
  { to: '/tarifas', label: 'Tarifas' },
  { to: '/clientes', label: 'Nuestros Clientes' },
]

// Mobile menu (BGSI-298): closed by default; Esc, a tap outside or a new page close it
const header = ref(null)
const { isOpen: isMenuOpen, toggle: toggleMenu, close: closeMenu } = useMobileMenu(header)

// Smart header: glass when scrolling, hidden going down, back when going up
const { isTranslucent, isHidden, isAtTop } = useScrollHeader()

</script>

<template>
  <header ref="header" class="app-header"
          :class="{
            'is-solid': !overlay && !isTranslucent,
            'is-translucent': isTranslucent || isMenuOpen,
            'is-hidden': isHidden && !isMenuOpen,
            'is-at-top': isAtTop,
            'has-divider': overlay && !isTranslucent && !isMenuOpen,
          }">
    <div class="container app-header__inner">
      <RouterLink to="/" class="app-header__brand" aria-label="Ir a Inicio" @click="closeMenu">
        <img :src="logo" alt="BG Sistemas Informáticos" class="app-header__logo" />
      </RouterLink>

      <button
        v-if="showNav"
        type="button"
        class="app-header__toggle"
        data-test="menu-toggle"
        aria-controls="main-nav"
        :aria-expanded="isMenuOpen"
        :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
        @click="toggleMenu"
      >
        <span></span><span></span><span></span>
      </button>

      <nav v-if="showNav" id="main-nav" class="app-header__nav" :class="{ 'is-open': isMenuOpen }" aria-label="Navegación principal">
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
  // Fixed: it floats over the hero instead of taking its own band of colour
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  transition: transform 0.3s ease, background-color 0.3s ease;

  // BGSI-226: thin white line under the header, only while resting over the hero
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.35);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &.has-divider::after { opacity: 1; }

  // Pages without hero (legal, 404, login): normal navy header
  &.is-solid { background: var(--color-navy); }

  // When scrolling: light "glass" so the white menu is always readable
  &.is-translucent {
    background: rgba(11, 31, 58, 0.55);
    backdrop-filter: blur(10px);
  }

  // BGSI-210: slides up out of the screen
  &.is-hidden { transform: translateY(-100%); }

  // Back at the top of the page: change at once, without animation
  &.is-at-top { transition: none; }

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
      transition: transform 0.2s, opacity 0.2s;
    }

    // BGSI-298: ☰ becomes ✕ while the menu is open
    &[aria-expanded='true'] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    &[aria-expanded='true'] span:nth-child(2) { opacity: 0; }
    &[aria-expanded='true'] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
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
