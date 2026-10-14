<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHero from '@/shared/PageHero.vue'
import PageBackdrop from '@/shared/PageBackdrop.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import ContactInfo from '@/components/contact/ContactInfo.vue'
import { useServiceOptions } from '@/composables/contact/useServiceOptions'

const { options, loadOptions } = useServiceOptions()

const route = useRoute()

// /contacto?producto=BDP One -> that product is already chosen (BGSI-207)
const initialService = computed(() => (typeof route.query.producto === 'string' ? route.query.producto : ''))

// /contacto?interes=demo or ?producto=... -> the message is already written
const initialMessage = computed(() => {
  if (route.query.interes === 'demo') return 'Hola, me gustaría solicitar una demo de vuestros sistemas.'
  if (initialService.value) return `Hola, me gustaría recibir información sobre ${initialService.value}.`
  return ''
})

// Row of advantages over the photo
const advantages = ['Respuesta < 24h', 'Soporte 365 días', 'Certificados oficiales', 'In situ & remoto']

onMounted(loadOptions)
</script>

<template>
  <PageBackdrop>
    <PageHero
      transparent
      eyebrow="Atención personalizada · Consultoría directa"
      title="Hablemos de tu negocio"
      subtitle="Cuéntanos qué necesitas y uno de nuestros consultores especializados te contactará en menos de 24 horas laborables."
    />

    <section class="contact">
      <div class="container">
        <!-- Moved out of the hero so every hero has the same height (BGSI-227) -->
        <ul class="contact__advantages">
          <li v-for="advantage in advantages" :key="advantage">{{ advantage }}</li>
        </ul>

        <!-- White card like the one of Tarifas -->
        <div class="contact__card">
          <ContactForm :services="options" :initial-message="initialMessage" :initial-service="initialService" />
          <ContactInfo />
        </div>
      </div>
    </section>
  </PageBackdrop>
</template>

<style scoped lang="scss">
.contact {
  padding: 1rem 0 4rem;

  // Glass chips over the photo
  &__advantages {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin: 0 0 1.5rem;
    padding: 0;
    list-style: none;

    li {
      padding: 0.75rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: var(--radius);
      background: rgba(11, 31, 58, 0.45);
      backdrop-filter: blur(6px);
      color: #fff;
      font-weight: 600;
      text-align: center;

      &::before { content: '✓ '; color: var(--color-orange); }
    }
  }

  &__card {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2.5rem;
    align-items: start;
    padding: 2.5rem;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  }
}

@media (max-width: 900px) {
  .contact__card { grid-template-columns: 1fr; }
  .contact__advantages { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .contact { padding: 0.5rem 0 2rem; }
  .contact__card { padding: 1.5rem 1rem; }
}

@media (max-width: 420px) {
  .contact__advantages li { padding: 0.6rem 0.5rem; font-size: 0.85rem; }
}
</style>
