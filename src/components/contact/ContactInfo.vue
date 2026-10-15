<script setup>
import WhatsAppIcon from '@/shared/WhatsAppIcon.vue'
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

  &__label {
    display: block;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #94a3b8;
  }
}
</style>
