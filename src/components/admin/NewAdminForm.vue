<script setup>
import PasswordInput from '@/shared/PasswordInput.vue'
import ConfirmFieldSteps from '@/components/admin/ConfirmFieldSteps.vue'
import { MIN_PASSWORD_LENGTH } from '@/composables/admin/useNewAdminForm'

// Presentational form: the state comes from useNewAdminForm (BGSI-197). Two steps (BGSI-294)
const props = defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, required: true },
  step: { type: Number, default: 1 },
  pasteBlocked: { type: Boolean, default: false },
  isSubmitting: { type: Boolean, default: false },
  submitError: { type: String, default: null },
})

const emit = defineEmits(['continue', 'back', 'submit', 'blocked-paste'])

// Enter or the orange button: step 1 goes on, step 2 creates the admin
function handleSubmit() {
  emit(props.step === 1 ? 'continue' : 'submit')
}
</script>

<template>
  <form class="admin-form" novalidate @submit.prevent="handleSubmit">
    <ConfirmFieldSteps :step="step" done-label="Email y contraseña introducidos"
                       second-hint="Repite el email y la contraseña." @back="emit('back')">
      <template #first>
        <div class="admin-form__field">
          <label for="admin-email">Email *</label>
          <input id="admin-email" v-model="form.email" type="email" autocomplete="off"
                 placeholder="nombre@bgsistemas.es" :aria-invalid="!!errors.email" />
          <p v-if="errors.email" class="admin-form__error">{{ errors.email }}</p>
        </div>

        <div class="admin-form__field">
          <label for="admin-password">Contraseña *</label>
          <PasswordInput id="admin-password" v-model="form.password" autocomplete="new-password"
                         :aria-invalid="!!errors.password" />
          <p v-if="errors.password" class="admin-form__error">{{ errors.password }}</p>
          <p v-else class="new-admin__hint">Mínimo {{ MIN_PASSWORD_LENGTH }} caracteres.</p>
        </div>
      </template>

      <template #second>
        <!-- Typed by hand: paste and drop are blocked -->
        <div class="admin-form__field">
          <label for="admin-confirm-email">Repite el email *</label>
          <input id="admin-confirm-email" v-model="form.confirmEmail" type="email" autocomplete="off"
                 :aria-invalid="!!errors.confirmEmail" aria-describedby="admin-confirm-email-error"
                 @paste.prevent="emit('blocked-paste')" @drop.prevent="emit('blocked-paste')" />
          <p v-if="errors.confirmEmail" id="admin-confirm-email-error" class="admin-form__error">{{ errors.confirmEmail }}</p>
          <!-- Right under the email (not under the password), so it is clear which field it means -->
          <p v-if="pasteBlocked" class="new-admin__paste" role="alert">✋ Este campo no admite pegar: escríbelo a mano.</p>
        </div>

        <div class="admin-form__field">
          <label for="admin-confirm">Repite la contraseña *</label>
          <PasswordInput id="admin-confirm" v-model="form.confirmPassword" autocomplete="new-password"
                         :aria-invalid="!!errors.confirmPassword" />
          <p v-if="errors.confirmPassword" class="admin-form__error">{{ errors.confirmPassword }}</p>
        </div>
      </template>

      <template #alert>
        <p v-if="submitError" class="admin-form__alert" role="alert">{{ submitError }}</p>
      </template>

      <template #submit>
        <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creando...' : 'Crear administrador' }}
        </button>
      </template>
    </ConfirmFieldSteps>
  </form>
</template>

<style scoped>
.new-admin__hint { margin: 0; font-size: 0.85rem; color: var(--color-muted); }

.new-admin__paste {
  margin: 0;
  padding: 0.45rem 0.7rem;
  border-radius: 6px;
  background: #fef3c7;
  color: #78350f;
  font-size: 0.85rem;
}
</style>
