<script setup>
import PasswordInput from '@/shared/PasswordInput.vue'
import ConfirmFieldSteps from '@/components/admin/ConfirmFieldSteps.vue'

// "Cambiar contraseña" form (BGSI-272) in two steps (BGSI-294). The logic lives in useChangePasswordForm
const props = defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, required: true },
  rules: { type: Array, required: true },
  step: { type: Number, default: 1 },
  isSubmitting: { type: Boolean, default: false },
  submitError: { type: String, default: null },
})

const emit = defineEmits(['continue', 'back', 'submit'])

// Enter or the orange button: step 1 goes on, step 2 saves
function handleSubmit() {
  emit(props.step === 1 ? 'continue' : 'submit')
}
</script>

<template>
  <form class="admin-form" novalidate @submit.prevent="handleSubmit">
    <ConfirmFieldSteps :step="step" done-label="Nueva contraseña elegida"
                       second-hint="Repite la nueva contraseña." @back="emit('back')">
      <template #first>
        <div class="admin-form__field">
          <label for="account-current">Contraseña actual *</label>
          <PasswordInput id="account-current" v-model="form.currentPassword" autocomplete="current-password"
                         :aria-invalid="!!errors.currentPassword" aria-describedby="account-current-error" />
          <p v-if="errors.currentPassword" id="account-current-error" class="admin-form__error">{{ errors.currentPassword }}</p>
        </div>

        <div class="admin-form__field">
          <label for="account-new">Nueva contraseña *</label>
          <PasswordInput id="account-new" v-model="form.newPassword" autocomplete="new-password"
                         :aria-invalid="!!errors.newPassword" aria-describedby="account-new-rules account-new-error" />
          <p v-if="errors.newPassword" id="account-new-error" class="admin-form__error">{{ errors.newPassword }}</p>

          <!-- Live checklist: each rule turns green while the admin types -->
          <ul id="account-new-rules" class="password-rules" aria-label="Requisitos de la contraseña">
            <li v-for="rule in rules" :key="rule.key" class="password-rules__item"
                :class="{ 'password-rules__item--ok': rule.ok }" :data-rule="rule.key">
              <span aria-hidden="true">{{ rule.ok ? '✓' : '•' }}</span>
              {{ rule.label }}
              <span class="visually-hidden">{{ rule.ok ? '(cumplido)' : '(pendiente)' }}</span>
            </li>
          </ul>
        </div>
      </template>

      <template #second>
        <div class="admin-form__field">
          <label for="account-confirm">Repite la nueva contraseña *</label>
          <PasswordInput id="account-confirm" v-model="form.confirmPassword" autocomplete="new-password"
                         :aria-invalid="!!errors.confirmPassword" aria-describedby="account-confirm-error" />
          <p v-if="errors.confirmPassword" id="account-confirm-error" class="admin-form__error">{{ errors.confirmPassword }}</p>
        </div>
      </template>

      <template #alert>
        <p v-if="submitError" class="admin-form__alert" role="alert">{{ submitError }}</p>
      </template>

      <template #submit>
        <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Guardando...' : 'Cambiar contraseña' }}
        </button>
      </template>
    </ConfirmFieldSteps>
  </form>
</template>

<style scoped lang="scss">
.password-rules {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 0.25rem 1rem;
  margin: 0.35rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;

  &__item {
    display: flex;
    gap: 0.4rem;
    color: var(--color-muted);
    transition: color 0.2s;

    &--ok { color: #15803d; font-weight: 600; }
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
