<script setup>
import { computed, onMounted, ref } from 'vue'

const MAX_LENGTH = 1000

const props = defineProps({
  contactName: { type: String, required: true },
  initialNote: { type: String, default: '' },
})

const emit = defineEmits(['save', 'cancel'])

const note = ref(props.initialNote || '')
const textarea = ref(null)
const isTooLong = computed(() => note.value.length > MAX_LENGTH)

onMounted(() => textarea.value?.focus())

function save() {
  if (isTooLong.value) return
  emit('save', note.value.trim())
}
</script>

<template>
  <div class="note-dialog" @click.self="emit('cancel')" @keydown.esc="emit('cancel')">
    <form class="note-dialog__box" role="dialog" aria-modal="true" aria-labelledby="note-title" @submit.prevent="save">
      <h2 id="note-title">Nota interna · {{ contactName }}</h2>
      <label for="note-text" class="note-dialog__label">Solo la ve el equipo de BG. Déjala vacía para borrarla.</label>
      <textarea id="note-text" ref="textarea" v-model="note" rows="5" :aria-invalid="isTooLong"></textarea>
      <p class="note-dialog__counter" :class="{ 'note-dialog__counter--error': isTooLong }">
        {{ note.length }} / {{ MAX_LENGTH }}
      </p>
      <div class="note-dialog__actions">
        <button type="button" class="note-dialog__cancel" @click="emit('cancel')">Cancelar</button>
        <button type="submit" class="btn btn--primary note-dialog__save" :disabled="isTooLong">Guardar nota</button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.note-dialog {
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
    max-width: 520px;
    padding: 1.75rem;
    background: #fff;
    border-radius: var(--radius);
    box-shadow: 0 10px 30px rgba(11, 31, 58, 0.2);

    h2 { margin: 0 0 0.5rem; font-size: 1.25rem; color: var(--color-navy); }

    textarea {
      width: 100%;
      padding: 0.7rem 0.9rem;
      font: inherit;
      border: 1px solid #d1d5db;
      border-radius: var(--radius);
      resize: vertical;

      &:focus { outline: 2px solid var(--color-orange); outline-offset: 1px; }
    }
  }

  &__label { display: block; margin-bottom: 0.75rem; color: var(--color-muted); }

  &__counter {
    margin: 0.25rem 0 1.25rem;
    font-size: 0.85rem;
    text-align: right;
    color: var(--color-muted);

    &--error { color: #b91c1c; }
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

  &__save {
    font: inherit;
    font-weight: 600;

    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
}
</style>
