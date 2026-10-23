<script setup>
import { RouterLink } from 'vue-router'
import logo from '@/assets/logo/logo_footer.png'
import WhatsAppIcon from '@/shared/WhatsAppIcon.vue'
import SocialIcon from '@/shared/SocialIcon.vue'
import { SOCIAL_LINKS, whatsappUrl } from '@/core/config/social'

// BGSI-324: in the admin area only the copyright bar is shown
defineProps({
  compact: { type: Boolean, default: false },
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer" :class="{ 'app-footer--compact': compact }">
    <div v-if="!compact" class="container app-footer__grid">
      <div class="app-footer__col app-footer__brand">
        <img :src="logo" alt="BG Sistemas Informáticos" class="app-footer__logo" />
        <p>Digitalización para hostelería y pymes.</p>
        <!-- BGSI-320: social networks as icons -->
        <ul class="app-footer__social" aria-label="Redes sociales">
          <li v-for="network in SOCIAL_LINKS" :key="network.key">
            <a :href="network.url" target="_blank" rel="noopener" class="app-footer__social-link"
               :aria-label="`${network.label} de BG Sistemas (se abre en una pestaña nueva)`" :title="network.label"
               :data-test="`social-${network.key}`">
              <SocialIcon :name="network.key" />
            </a>
          </li>
        </ul>
      </div>

      <div class="app-footer__col">
        <h2 class="app-footer__title">¿Hablamos?</h2>
        <p>Resolvemos tus dudas sin compromiso.</p>
        <!-- BGSI-320: "click to chat", without showing the number -->
        <a :href="whatsappUrl()" target="_blank" rel="noopener" class="app-footer__whatsapp" data-test="footer-whatsapp">
          <WhatsAppIcon :size="20" />
          Escríbenos por WhatsApp
          <span class="sr-only">(se abre en una pestaña nueva)</span>
        </a>
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
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 2rem;
  }

  &__col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;

    p { margin: 0; }
  }

  &__brand p { margin-top: 0.5rem; }

  &__logo {
    width: auto;
    height: 64px;
  }

  &__title {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: #fff;
  }

  &__social {
    display: flex;
    gap: 0.75rem;
    margin: 0.75rem 0 0;
    padding: 0;
    list-style: none;
  }

  &__social-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(203, 213, 225, 0.35);
    border-radius: 50%;
    color: #fff;
    transition: background 0.2s, border-color 0.2s, color 0.2s;

    &:hover,
    &:focus-visible {
      color: var(--color-navy);
      background: var(--color-orange);
      border-color: var(--color-orange);
    }
  }

  &__whatsapp {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.5rem;
    padding: 0.6rem 1rem;
    border: 1px solid rgba(37, 211, 102, 0.6);
    border-radius: 999px;
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s;

    &:hover,
    &:focus-visible { background: rgba(37, 211, 102, 0.15); }
  }

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

  // BGSI-324: admin area, only the bar with the copyright
  &--compact {
    padding-top: 0;

    .app-footer__copy { margin: 0; border-top: 0; }
  }
}

@media (max-width: 900px) {
  .app-footer__grid { grid-template-columns: repeat(2, 1fr); }
  .app-footer__brand { grid-column: 1 / -1; }
}

@media (max-width: 560px) {
  .app-footer__grid { grid-template-columns: 1fr; }
}
</style>
