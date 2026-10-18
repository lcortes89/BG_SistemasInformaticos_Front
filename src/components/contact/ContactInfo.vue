<script setup>
import WhatsAppIcon from '@/shared/WhatsAppIcon.vue'
import { OFFICE } from '@/core/config/office'
</script>

<template>
  <aside class="contact-info">
    <h2>Hablemos</h2>
    <p>Cuéntanos qué necesita tu negocio y te asesoramos sin compromiso.</p>

    <ul class="contact-info__list">
      <li>
        <span class="contact-info__label">WhatsApp</span>
        <a href="https://wa.me/34615471066" target="_blank" rel="noopener" class="contact-info__whatsapp">
          <WhatsAppIcon :size="24" />
          +34 615 471 066
        </a>
      </li>
      <li>
        <span class="contact-info__label">Facebook</span>
        <a href="https://www.facebook.com/bgconsultoria/" target="_blank" rel="noopener">BG Consultoría</a>
      </li>
    </ul>

    <!-- BGSI-250: where the office is -->
    <div class="contact-info__office">
      <span class="contact-info__label">Oficina</span>
      <p class="contact-info__address">{{ OFFICE.address }}</p>
      <iframe :src="OFFICE.mapUrl" title="Mapa de la oficina de BG Sistemas Informáticos en Ribadeo"
              class="contact-info__map" loading="lazy" referrerpolicy="no-referrer"></iframe>
      <a :href="OFFICE.directionsUrl" target="_blank" rel="noopener noreferrer" class="contact-info__directions">
        Cómo llegar <span aria-hidden="true">↗</span>
        <span class="sr-only">(se abre en otra pestaña)</span>
      </a>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.contact-info {
  padding: 2rem;
  color: #e2e8f0;
  background: var(--color-navy);
  border-radius: var(--radius);

  h2 { margin: 0 0 0.75rem; color: #fff; }
  p { margin: 0 0 1.5rem; }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;

    a { color: var(--color-orange); font-weight: 600; text-decoration: none; }
  }

  // BGSI-242: green icon + number, aligned
  &__whatsapp { display: inline-flex; align-items: center; gap: 0.5rem; }

  // BGSI-250: office address and map
  &__office {
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  &__address { margin: 0.25rem 0 0.75rem; color: #fff; font-weight: 600; }

  &__map {
    display: block;
    width: 100%;
    height: 200px;
    border: 0;
    border-radius: var(--radius);
    background: #1e3a5f;
  }

  &__directions {
    display: inline-block;
    margin-top: 0.75rem;
    color: var(--color-orange);
    font-weight: 600;
    text-decoration: none;

    &:hover,
    &:focus-visible { text-decoration: underline; }
  }

  &__label {
    display: block;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #94a3b8;
  }
}
</style>
