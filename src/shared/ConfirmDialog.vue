<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirmar' },
})

const emit = defineEmits(['confirm', 'cancel'])
const confirmButton = ref(null)

// Keyboard users land directly on the main action
onMounted(() => confirmButton.value?.focus())
</script>

<template>
  <div class="confirm-dialog" @click.self="emit('cancel')" @keydown.esc="emit('cancel')">
    <div class="confirm-dialog__box" role="alertdialog" aria-modal="true"
         aria-labelledby="confirm-title" aria-describedby="confirm-message">
      <h2 id="confirm-title">{{ title }}</h2>
      <p id="confirm-message">{{ message }}</p>
      <div class="confirm-dialog__actions">
        <button type="button" class="confirm-dialog__cancel" @click="emit('cancel')">Cancelar</button>
        <button ref="confirmButton" type="button" class="btn btn--primary confirm-dialog__confirm"
                @click="emit('confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.confirm-dialog {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(11, 31, 58, 0.45);

  &__box {
    width: 100%;
    max-width: 420px;
    padding: 1.75rem;
    background: #fff;
    border-radius: var(--radius);
    box-shadow: 0 10px 30px rgba(11, 31, 58, 0.2);

    h2 { margin: 0 0 0.5rem; font-size: 1.25rem; color: var(--color-navy); }
    p { margin: 0 0 1.5rem; color: var(--color-text); }
  }

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

  &__confirm { font: inherit; font-weight: 600; }
}
</style>
