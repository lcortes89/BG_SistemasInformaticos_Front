<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHero from '@/shared/PageHero.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import ContactInfo from '@/components/contact/ContactInfo.vue'
import { useServiceOptions } from '@/composables/contact/useServiceOptions'

const { options, loadOptions } = useServiceOptions()

const route = useRoute()

// /contacto?interes=demo -> the message is already written
const initialMessage = computed(() =>
  route.query.interes === 'demo' ? 'Hola, me gustaría solicitar una demo de vuestros sistemas.' : '')

// Row of advantages under the title (prototype)
const advantages = ['Respuesta < 24h', 'Soporte 365 días', 'Certificados oficiales', 'In situ & remoto']

onMounted(loadOptions)
</script>

<template>
  <PageHero
    breadcrumb="Contacto"
    eyebrow="Atención personalizada · Consultoría directa"
    title="Hablemos de tu negocio"
    subtitle="Cuéntanos qué necesitas y uno de nuestros consultores especializados te contactará en menos de 24 horas laborables."
  >
    <ul class="contact__advantages">
      <li v-for="advantage in advantages" :key="advantage">{{ advantage }}</li>
    </ul>
  </PageHero>

  <section class="contact">
    <div class="container">
      <div class="contact__grid">
        <ContactForm :services="options" :initial-message="initialMessage" />
        <ContactInfo />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact {
  padding: 3rem 0 4rem;

  &__advantages {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: 0.75rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: var(--radius);
      font-weight: 600;
      text-align: center;

      &::before { content: '✓ '; color: var(--color-orange); }
    }
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
  .contact__advantages { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 420px) {
  .contact__advantages li { padding: 0.6rem 0.5rem; font-size: 0.85rem; }
}
</style>
