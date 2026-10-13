<script setup>
import { RouterLink } from 'vue-router'
import { useContactForm } from '@/composables/contact/useContactForm'

const props = defineProps({
  services: { type: Array, default: () => [] },
  // Optional: lets the tests pass a fake ContactService
  contactService: { type: Object, default: undefined },
  // Optional: text that appears already written in "Mensaje" (e.g. from Solicita tu demo)
  initialMessage: { type: String, default: '' },
})

const { form, errors, isSubmitting, isSuccess, submitError, submit } = useContactForm(props.contactService, props.initialMessage ? { message: props.initialMessage } : {})
</script>

<template>
  <form class="contact-form" novalidate @submit.prevent="submit">
    <div class="contact-form__field">
      <label for="contact-name">Nombre *</label>
      <input id="contact-name" v-model="form.name" type="text" autocomplete="name"
             :aria-invalid="!!errors.name" aria-describedby="contact-name-error" />
      <Transition name="slide-fade">
        <p v-if="errors.name" id="contact-name-error" class="contact-form__error">{{ errors.name }}</p>
      </Transition>
    </div>

    <div class="contact-form__row">
      <div class="contact-form__field">
        <label for="contact-email">Email *</label>
        <input id="contact-email" v-model="form.email" type="email" autocomplete="email"
               :aria-invalid="!!errors.email" aria-describedby="contact-email-error" />
        <Transition name="slide-fade">
          <p v-if="errors.email" id="contact-email-error" class="contact-form__error">{{ errors.email }}</p>
        </Transition>
      </div>

      <div class="contact-form__field">
        <label for="contact-phone">Teléfono</label>
        <input id="contact-phone" v-model="form.phone" type="tel" autocomplete="tel"
               :aria-invalid="!!errors.phone" aria-describedby="contact-phone-error" />
        <Transition name="slide-fade">
          <p v-if="errors.phone" id="contact-phone-error" class="contact-form__error">{{ errors.phone }}</p>
        </Transition>
      </div>
    </div>

    <div class="contact-form__field">
      <label for="contact-service">Servicio de interés</label>
      <select id="contact-service" v-model="form.interestedService">
        <option value="">Selecciona un servicio (opcional)</option>
        <option v-for="service in services" :key="service.id" :value="service.name">
          {{ service.brandName ? `${service.brandName} · ` : '' }}{{ service.name }}
        </option>
      </select>
    </div>

    <div class="contact-form__field">
      <label for="contact-message">Mensaje *</label>
      <textarea id="contact-message" v-model="form.message" rows="5"
                :aria-invalid="!!errors.message" aria-describedby="contact-message-error"></textarea>
      <Transition name="slide-fade">
        <p v-if="errors.message" id="contact-message-error" class="contact-form__error">{{ errors.message }}</p>
      </Transition>
    </div>

    <div class="contact-form__field">
      <label class="contact-form__checkbox">
        <input id="contact-gdpr" v-model="form.gdprConsent" type="checkbox"
               :aria-invalid="!!errors.gdprConsent" aria-describedby="contact-gdpr-error" />
        <span>
          He leído y acepto la <RouterLink to="/privacidad" target="_blank">política de privacidad</RouterLink> *
        </span>
      </label>
      <Transition name="slide-fade">
        <p v-if="errors.gdprConsent" id="contact-gdpr-error" class="contact-form__error">{{ errors.gdprConsent }}</p>
      </Transition>
    </div>

    <Transition name="slide-fade">
      <p v-if="submitError" class="contact-form__alert contact-form__alert--error" role="alert">{{ submitError }}</p>
    </Transition>
    <Transition name="slide-fade">
      <p v-if="isSuccess" class="contact-form__alert contact-form__alert--success" role="status">
        ¡Gracias! Hemos recibido tu mensaje y te contactaremos lo antes posible.
      </p>
    </Transition>

    <button type="submit" class="btn btn--primary contact-form__submit" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="contact-form__spinner" aria-hidden="true"></span>
      {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  &__field { display: flex; flex-direction: column; gap: 0.35rem; }

  label { font-weight: 600; color: var(--color-navy); }

  input:not([type='checkbox']), select, textarea {
    padding: 0.7rem 0.9rem;
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
    margin: 0;
    padding: 0.9rem 1rem;
    border-radius: var(--radius);

    &--error { color: #7f1d1d; background: #fee2e2; }
    &--success { color: #14532d; background: #dcfce7; }
  }

  &__submit {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    align-self: flex-start;

    &:disabled { opacity: 0.7; cursor: not-allowed; }
  }

  &__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 560px) {
  .contact-form__row { grid-template-columns: 1fr; }
}
</style>
