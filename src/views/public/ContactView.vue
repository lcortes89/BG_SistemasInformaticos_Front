<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ContactForm from '@/components/contact/ContactForm.vue'
import ContactInfo from '@/components/contact/ContactInfo.vue'
import { useServiceOptions } from '@/composables/contact/useServiceOptions'

const { options, loadOptions } = useServiceOptions()

const route = useRoute()

// /contacto?interes=demo -> the message is already written
const initialMessage = computed(() =>
  route.query.interes === 'demo' ? 'Hola, me gustaría solicitar una demo de vuestros sistemas.' : '')

onMounted(loadOptions)
</script>

<template>
  <section class="contact">
    <div class="container">
      <header class="contact__header">
        <h1>Contacto</h1>
        <p>Rellena el formulario y nos pondremos en contacto contigo.</p>
      </header>

      <div class="contact__grid">
        <ContactForm :services="options" :initial-message="initialMessage" />
        <ContactInfo />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact {
  padding: 4rem 0;

  &__header {
    max-width: 720px;
    margin: 0 auto 3rem;
    text-align: center;

    h1 { margin: 0 0 1rem; color: var(--color-navy); }
    p { margin: 0; color: var(--color-muted); }
  }

  &__grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2.5rem;
    align-items: start;
  }
}

@media (max-width: 900px) {
  .contact__grid { grid-template-columns: 1fr; }
}
</style>
