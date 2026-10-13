<script setup>
import { RouterLink } from 'vue-router'
import { useRateProposal } from '@/composables/rates/useRateProposal'

const props = defineProps({
  answers: { type: Object, required: true },
  quote: { type: Object, required: true }, // RateQuoteModel
  // Optional: lets the tests pass a fake ContactService
  contactService: { type: Object, default: undefined },
})

const { form, errors, isSubmitting, isSuccess, submitError, submit } = useRateProposal(props.contactService)
</script>

<template>
  <p v-if="isSuccess" class="proposal__alert proposal__alert--success" role="status">
    ¡Gracias! Hemos recibido tus respuestas y te enviaremos la propuesta en menos de 24 horas laborables.
  </p>

  <form v-else class="proposal" novalidate @submit.prevent="submit(answers, quote)">
    <p class="proposal__intro">
      Déjanos tus datos y te enviamos la propuesta. <strong>Tus respuestas ya van incluidas.</strong>
    </p>

    <div class="proposal__row">
      <div class="proposal__field">
        <label for="proposal-name">Nombre *</label>
        <input id="proposal-name" v-model="form.name" type="text" autocomplete="name"
               :aria-invalid="!!errors.name" aria-describedby="proposal-name-error" />
        <p v-if="errors.name" id="proposal-name-error" class="proposal__error">{{ errors.name }}</p>
      </div>
      <div class="proposal__field">
        <label for="proposal-email">Email *</label>
        <input id="proposal-email" v-model="form.email" type="email" autocomplete="email"
               :aria-invalid="!!errors.email" aria-describedby="proposal-email-error" />
        <p v-if="errors.email" id="proposal-email-error" class="proposal__error">{{ errors.email }}</p>
      </div>
    </div>

    <div class="proposal__field">
      <label for="proposal-phone">Teléfono</label>
      <input id="proposal-phone" v-model="form.phone" type="tel" autocomplete="tel"
             :aria-invalid="!!errors.phone" aria-describedby="proposal-phone-error" />
      <p v-if="errors.phone" id="proposal-phone-error" class="proposal__error">{{ errors.phone }}</p>
    </div>

    <div class="proposal__field">
      <label for="proposal-comment">Comentario (opcional)</label>
      <textarea id="proposal-comment" v-model="form.comment" rows="3"
                placeholder="Por ejemplo: abrimos un segundo local en marzo"
                :aria-invalid="!!errors.comment" aria-describedby="proposal-comment-error"></textarea>
      <p v-if="errors.comment" id="proposal-comment-error" class="proposal__error">{{ errors.comment }}</p>
    </div>

    <div class="proposal__field">
      <label class="proposal__checkbox">
        <input id="proposal-gdpr" v-model="form.gdprConsent" type="checkbox"
               :aria-invalid="!!errors.gdprConsent" aria-describedby="proposal-gdpr-error" />
        <span>He leído y acepto la <RouterLink to="/privacidad" target="_blank">política de privacidad</RouterLink> *</span>
      </label>
      <p v-if="errors.gdprConsent" id="proposal-gdpr-error" class="proposal__error">{{ errors.gdprConsent }}</p>
    </div>

    <Transition name="slide-fade">
      <p v-if="submitError" class="proposal__alert proposal__alert--error" role="alert">{{ submitError }}</p>
    </Transition>

    <button type="submit" class="btn btn--primary proposal__submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Enviando…' : 'Enviar solicitud' }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.proposal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 560px;
  margin: 0 auto;
  text-align: left;

  &__intro { margin: 0; color: var(--color-text); }
  &__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  &__field { display: flex; flex-direction: column; gap: 0.35rem; }

  label { font-weight: 600; color: var(--color-navy); }

  input:not([type='checkbox']), textarea {
    padding: 0.65rem 0.85rem;
    font: inherit;
    border: 1px solid #d1d5db;
    border-radius: var(--radius);

    &:focus { outline: 2px solid var(--color-orange); outline-offset: 1px; }
    &[aria-invalid='true'] { border-color: #b91c1c; }
  }

  &__checkbox {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    font-weight: 400 !important;
    color: var(--color-text) !important;

    input { margin-top: 0.3rem; }
    a { color: var(--color-orange-dark); }
  }

  &__error { margin: 0; font-size: 0.875rem; color: #b91c1c; }

  &__alert {
    margin: 0 auto;
    max-width: 560px;
    padding: 0.9rem 1rem;
    border-radius: var(--radius);

    &--error { color: #7f1d1d; background: #fee2e2; }
    &--success { color: #14532d; background: #dcfce7; }
  }

  &__submit {
    align-self: flex-start;
    font: inherit;
    font-weight: 700;

    &:disabled { opacity: 0.7; cursor: not-allowed; }
  }
}

@media (max-width: 560px) {
  .proposal__row { grid-template-columns: 1fr; }
  .proposal__submit { align-self: stretch; }
}
</style>
