<script setup>
import { onMounted } from 'vue'
import ConfirmFieldSteps from '@/components/admin/ConfirmFieldSteps.vue'
import { expiryText, useEmailChange } from '@/composables/admin/useEmailChange'

// BGSI-301: change my own email. The link goes to the new email; the change is made when it is opened
const props = defineProps({
  currentEmail: { type: String, default: '' },
  // Optional: lets the tests pass a fake AccountService
  service: { type: Object, default: undefined },
})

const {
  view, pending, form, errors, isBusy, submitError, feedback,
  load, submit, cancel, step, pasteBlocked, next, back, blockPaste,
} = useEmailChange(props.service, () => props.currentEmail)

onMounted(load)

// Enter or the orange button: step 1 goes on, step 2 sends the link
function handleSubmit() {
  if (step.value === 1) next()
  else submit()
}
</script>

<template>
  <div class="change-email">
    <div class="change-email__head">
      <h2 class="change-email__title">Cambiar mi email</h2>
      <span v-if="view === 'pending'" class="change-email__badge">Pendiente de confirmar</span>
    </div>

    <Transition name="slide-fade">
      <p v-if="feedback" class="change-email__feedback" role="status">{{ feedback }}</p>
    </Transition>

    <p v-if="view === 'loading'" class="change-email__text">Cargando...</p>

    <!-- Waiting for the link -->
    <template v-else-if="view === 'pending'">
      <div class="change-email__sent" role="status">
        <span class="change-email__icon" aria-hidden="true">✉</span>
        <div>
          <p><strong>Revisa tu correo nuevo.</strong></p>
          <p>Hemos enviado un enlace a</p>
          <p class="change-email__address" data-test="pending-email">{{ pending.newEmail }}</p>
          <p>Ábrelo <strong>{{ expiryText(pending.expiresAt) }}</strong> para terminar el cambio.</p>
        </div>
      </div>
      <p class="change-email__text">
        Hasta entonces sigues entrando con <strong>{{ currentEmail }}</strong>. Al confirmarlo se cerrarán todas tus sesiones.
      </p>
      <p class="change-email__hint">¿No te llega? Mira en spam, o cancela y vuelve a pedirlo.</p>
      <p v-if="submitError" class="admin-form__alert" role="alert">{{ submitError }}</p>
      <button type="button" class="admin-form__cancel change-email__cancel" :disabled="isBusy" data-test="cancel"
              @click="cancel">
        {{ isBusy ? 'Cancelando...' : 'Cancelar el cambio' }}
      </button>
    </template>

    <!-- Form -->
    <form v-else class="admin-form" novalidate @submit.prevent="handleSubmit">
      <p class="change-email__text">
        Te enviaremos un enlace al email nuevo. El cambio se hace <strong>cuando lo abras</strong>
        (vale 1 hora), así nos aseguramos de que está bien escrito y es tuyo.
      </p>

      <ConfirmFieldSteps :step="step" done-label="Email nuevo introducido" second-hint="Repite el email nuevo."
                         :paste-blocked="pasteBlocked" @back="back">
        <template #first>
          <div class="admin-form__field">
            <label for="change-email-new">Email nuevo</label>
            <input id="change-email-new" v-model="form.newEmail" type="email" autocomplete="off"
                   placeholder="nombre@bgsistemas.es" :aria-invalid="!!errors.newEmail"
                   aria-describedby="change-email-new-error" />
            <p v-if="errors.newEmail" id="change-email-new-error" class="admin-form__error">{{ errors.newEmail }}</p>
          </div>
        </template>

        <template #second>
          <!-- Typed by hand: paste and drop are blocked -->
          <div class="admin-form__field">
            <label for="change-email-confirm">Repite el email nuevo</label>
            <input id="change-email-confirm" v-model="form.confirmEmail" type="email" autocomplete="off"
                   :aria-invalid="!!errors.confirmEmail" aria-describedby="change-email-confirm-error"
                   @paste="blockPaste" @drop="blockPaste" />
            <p v-if="errors.confirmEmail" id="change-email-confirm-error" class="admin-form__error">{{ errors.confirmEmail }}</p>
          </div>
        </template>

        <template #alert>
          <p v-if="submitError" class="admin-form__alert" role="alert">{{ submitError }}</p>
        </template>

        <template #submit>
          <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isBusy">
            {{ isBusy ? 'Enviando...' : 'Enviar enlace' }}
          </button>
        </template>
      </ConfirmFieldSteps>
    </form>
  </div>
</template>

<style scoped lang="scss">
.change-email {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem; }
  &__title { margin: 0; font-size: 1.15rem; color: var(--color-navy); }

  &__badge {
    padding: 0.2rem 0.65rem;
    font-size: 0.8rem;
    font-weight: 700;
    border-radius: 999px;
    color: #92400e;
    background: #fef3c7;
  }

  &__text { margin: 0; color: #374151; line-height: 1.55; overflow-wrap: anywhere; }
  .admin-form > &__text { margin-bottom: 1.25rem; }
  &__hint { margin: -0.5rem 0 0; font-size: 0.85rem; color: #6b7280; }
  &__feedback { margin: 0; padding: 0.8rem 1rem; border-radius: var(--radius); color: #065f46; background: #ecfdf5; }

  &__sent {
    display: flex;
    gap: 0.9rem;
    padding: 1rem;
    border-radius: var(--radius);
    color: #1e3a5f;
    background: #eff6ff;
    line-height: 1.5;

    p { margin: 0; }
    p + p { margin-top: 0.25rem; }
  }

  &__address { font-weight: 700; color: var(--color-navy); overflow-wrap: anywhere; }
  &__icon { font-size: 1.6rem; line-height: 1; color: var(--color-navy); }
  &__cancel { align-self: flex-start; color: #b91c1c !important; }
}
</style>
