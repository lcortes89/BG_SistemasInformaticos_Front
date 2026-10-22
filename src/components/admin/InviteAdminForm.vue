<script setup>
import ConfirmFieldSteps from '@/components/admin/ConfirmFieldSteps.vue'

// Presentational form: the state comes from useInviteAdminForm (BGSI-277). Two steps (BGSI-294)
const props = defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, required: true },
  step: { type: Number, default: 1 },
  pasteBlocked: { type: Boolean, default: false },
  isSubmitting: { type: Boolean, default: false },
  submitError: { type: String, default: null },
})

const emit = defineEmits(['continue', 'back', 'submit', 'blocked-paste', 'cancel'])

// Enter or the orange button: step 1 goes on, step 2 sends the invitation
function handleSubmit() {
  emit(props.step === 1 ? 'continue' : 'submit')
}
</script>

<template>
  <form class="admin-form" novalidate @submit.prevent="handleSubmit">
    <p class="invite-admin__intro">
      Le llegará un correo para crear <strong>su propia contraseña</strong>. El enlace vale 24 horas y solo se puede usar una vez.
    </p>

    <ConfirmFieldSteps :step="step" done-label="Email introducido" second-hint="Repite el email."
                       :paste-blocked="pasteBlocked" @back="emit('back')">
      <template #first>
        <div class="admin-form__field">
          <label for="invite-email">Email *</label>
          <input id="invite-email" v-model="form.email" type="email" autocomplete="off"
                 placeholder="nombre@bgsistemas.es" :aria-invalid="!!errors.email"
                 aria-describedby="invite-email-error" />
          <p v-if="errors.email" id="invite-email-error" class="admin-form__error">{{ errors.email }}</p>
        </div>
      </template>

      <template #first-actions>
        <button type="button" class="invite-admin__cancel" @click="emit('cancel')">Cancelar</button>
      </template>

      <template #second>
        <!-- Typed by hand: paste and drop are blocked -->
        <div class="admin-form__field">
          <label for="invite-confirm-email">Repite el email *</label>
          <input id="invite-confirm-email" v-model="form.confirmEmail" type="email" autocomplete="off"
                 :aria-invalid="!!errors.confirmEmail" aria-describedby="invite-confirm-email-error"
                 @paste.prevent="emit('blocked-paste')" @drop.prevent="emit('blocked-paste')" />
          <p v-if="errors.confirmEmail" id="invite-confirm-email-error" class="admin-form__error">{{ errors.confirmEmail }}</p>
        </div>
      </template>

      <template #alert>
        <p v-if="submitError" class="admin-form__alert" role="alert">{{ submitError }}</p>
      </template>

      <template #submit>
        <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Enviando...' : 'Enviar invitación' }}
        </button>
      </template>
    </ConfirmFieldSteps>
  </form>
</template>

<style scoped>
.invite-admin__intro { margin: 0 0 1.25rem; color: var(--color-muted); line-height: 1.5; }

.invite-admin__cancel {
  margin-right: auto;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--color-navy);
  background: none;
  border: 0;
  cursor: pointer;
}

.invite-admin__cancel:hover { text-decoration: underline; }
</style>
