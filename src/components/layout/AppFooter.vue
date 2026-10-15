<script setup>
import { RouterLink } from 'vue-router'
import logo from '@/assets/logo/logo_footer.png'
import WhatsAppIcon from '@/shared/WhatsAppIcon.vue'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container app-footer__grid">
      <div class="app-footer__col">
        <img :src="logo" alt="BG Sistemas Informáticos" class="app-footer__logo" />
        <p>Digitalización para hostelería y pymes.</p>
        <a href="https://www.facebook.com/bgconsultoria/" target="_blank" rel="noopener" class="app-footer__link">
          Facebook
        </a>
      </div>

      <div class="app-footer__col">
        <h2 class="app-footer__title">Navegación</h2>
        <RouterLink to="/" class="app-footer__link">Inicio</RouterLink>
        <RouterLink to="/soluciones" class="app-footer__link">Soluciones</RouterLink>
        <RouterLink to="/tarifas" class="app-footer__link">Tarifas</RouterLink>
        <RouterLink to="/clientes" class="app-footer__link">Nuestros Clientes</RouterLink>
      </div>

      <div class="app-footer__col">
        <h2 class="app-footer__title">Contacto</h2>
        <a href="https://wa.me/34615471066" target="_blank" rel="noopener"
           class="app-footer__link app-footer__whatsapp" aria-label="WhatsApp +34 615 471 066">
          <WhatsAppIcon />
          +34 615 471 066
        </a>
        <RouterLink to="/contacto" class="app-footer__link">Formulario de contacto</RouterLink>
      </div>

      <div class="app-footer__col">
        <h2 class="app-footer__title">Legal</h2>
        <RouterLink to="/aviso-legal" class="app-footer__link">Aviso legal</RouterLink>
        <RouterLink to="/privacidad" class="app-footer__link">Política de privacidad</RouterLink>
        <RouterLink to="/cookies" class="app-footer__link">Política de cookies</RouterLink>
      </div>
    </div>

    <p class="app-footer__copy">© {{ currentYear }} BG Sistemas Informáticos. Todos los derechos reservados.</p>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  padding-top: 3rem;
  color: #cbd5e1;
  background: var(--color-navy);

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__logo {
    align-self: flex-start;
    width: auto;
    height: 64px;
  }

  &__title {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: #fff;
  }

  // BGSI-242: green icon + number, aligned
  &__whatsapp { display: inline-flex; align-items: center; gap: 0.5rem; }

  &__link {
    color: #cbd5e1;
    text-decoration: none;

    &:hover {
      color: var(--color-orange);
    }
  }

  &__copy {
    margin: 2rem 0 0;
    padding: 1rem 16px;
    font-size: 0.875rem;
    text-align: center;
    border-top: 1px solid var(--color-navy-light);
  }
}

@media (max-width: 900px) {
  .app-footer__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .app-footer__grid { grid-template-columns: 1fr; }
}
</style>
