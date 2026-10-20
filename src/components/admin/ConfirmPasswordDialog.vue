<script setup>
import { onMounted, ref } from 'vue'
import PasswordInput from '@/shared/PasswordInput.vue'
import { useConfirmPasswordForm } from '@/composables/admin/useConfirmPasswordForm'

// BGSI-275: asked before a sensitive action (delete, contact email, new admin).
// Emits confirmed({ token, expiresInSeconds }) or cancel
const props = defineProps({
  service: { type: Object, default: undefined },
})

const emit = defineEmits(['confirmed', 'cancel'])

const { password, error, isSubmitting, submit } = useConfirmPasswordForm(props.service)
const box = ref(null)

onMounted(() => box.value?.querySelector('input')?.focus())

async function handleSubmit() {
  const result = await submit()
  if (result) emit('confirmed', result)
  else box.value?.querySelector('input')?.focus()
}
</script>

<template>
  <div class="confirm-password" @click.self="emit('cancel')" @keydown.esc="emit('cancel')">
    <form ref="box" class="confirm-password__box" role="dialog" aria-modal="true" novalidate
          aria-labelledby="confirm-password-title" aria-describedby="confirm-password-text"
          @submit.prevent="handleSubmit">
      <p class="confirm-password__icon" aria-hidden="true">🔒</p>
      <h2 id="confirm-password-title">Confirma tu contraseña</h2>
      <p id="confirm-password-text">
        Es una acción sensible. Por seguridad, escribe tu contraseña para continuar.
        No te la volveremos a pedir durante <strong>5 minutos</strong>.
      </p>

      <div class="confirm-password__field">
        <label for="confirm-password-input">Contraseña</label>
        <PasswordInput id="confirm-password-input" v-model="password" autocomplete="current-password"
                       :aria-invalid="!!error" aria-describedby="confirm-password-error" />
        <p v-if="error" id="confirm-password-error" class="confirm-password__error" role="alert">{{ error }}</p>
      </div>

      <div class="confirm-password__actions">
        <button type="button" class="confirm-password__cancel" @click="emit('cancel')">Cancelar</button>
        <button type="submit" class="btn btn--primary confirm-password__submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Comprobando...' : 'Confirmar' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.confirm-password {
  position: fixed;
  inset: 0;
  z-index: 250;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(11, 31, 58, 0.55);

  &__box {
    width: 100%;
    max-width: 420px;
    padding: 2rem 1.75rem 1.5rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(11, 31, 58, 0.25);

    h2 { margin: 0 0 0.5rem; font-size: 1.35rem; color: var(--color-navy); text-align: center; }
    > p { margin: 0 0 1.25rem; color: #374151; text-align: center; }
  }

  &__icon { font-size: 2.2rem; margin-bottom: 0.25rem !important; }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1.5rem;

    label { font-weight: 600; color: var(--color-navy); }

    :deep(input) {
      padding: 0.7rem 0.85rem;
      font: inherit;
      border: 1px solid #d1d5db;
      border-radius: var(--radius);
    }

    :deep(input[aria-invalid='true']) { border-color: #b91c1c; }
  }

  &__error { margin: 0; color: #b91c1c; font-size: 0.9rem; font-weight: 600; }

  &__actions { display: flex; justify-content: flex-end; gap: 0.75rem; }

  &__cancel {
    padding: 0.65rem 1.2rem;
    font: inherit;
    font-weight: 600;
    color: var(--color-navy);
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: var(--radius);
    cursor: pointer;
  }

  &__submit { font: inherit; font-weight: 600; }
}
</style>
