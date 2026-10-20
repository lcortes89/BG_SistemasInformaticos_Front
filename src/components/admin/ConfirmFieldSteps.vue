<script setup>
import { nextTick, ref, watch } from 'vue'

// BGSI-294: layout of a form in two steps (see useConfirmStep).
// The parent <form> decides on submit: step 1 -> next(), step 2 -> save.
const props = defineProps({
  step: { type: Number, required: true },
  doneLabel: { type: String, required: true }, // "Nueva contraseña elegida"
  secondHint: { type: String, default: '' }, // read by screen readers when step 2 appears
  pasteBlocked: { type: Boolean, default: false },
  continueLabel: { type: String, default: 'Continuar →' },
  continueDisabled: { type: Boolean, default: false },
  showProgress: { type: Boolean, default: true },
})

const emit = defineEmits(['back'])

const secondPanel = ref(null)

// The first field of step 2 gets the focus (keyboard and screen reader users)
function focusSecond() {
  secondPanel.value?.querySelector('input')?.focus()
}

watch(() => props.step, async (step) => {
  if (step !== 2) return
  await nextTick()
  focusSecond()
})
</script>

<template>
  <div class="confirm-steps">
    <div v-if="showProgress" class="confirm-steps__progress" role="progressbar" aria-valuemin="1" aria-valuemax="2"
         :aria-valuenow="step" :aria-label="`Paso ${step} de 2`">
      <span class="confirm-steps__bar confirm-steps__bar--on" />
      <span class="confirm-steps__bar" :class="{ 'confirm-steps__bar--on': step === 2 }" />
    </div>
    <p class="visually-hidden" aria-live="polite">{{ step === 2 ? `Paso 2 de 2. ${secondHint}` : '' }}</p>

    <Transition name="slide-fade" mode="out-in" @after-enter="focusSecond">
      <div v-if="step === 1" key="first" class="confirm-steps__panel">
        <slot name="first" />
        <slot name="alert" />
        <div class="admin-form__actions confirm-steps__actions">
          <slot name="first-actions" />
          <button type="submit" class="btn btn--primary admin-form__submit" data-test="continue"
                  :disabled="continueDisabled">
            {{ continueLabel }}
          </button>
        </div>
      </div>

      <div v-else key="second" ref="secondPanel" class="confirm-steps__panel">
        <div class="confirm-steps__done">
          <span>✓ {{ doneLabel }}</span>
          <button type="button" class="confirm-steps__change" data-test="change" @click="emit('back')">Cambiar</button>
        </div>
        <slot name="second" />
        <p v-if="pasteBlocked" class="confirm-steps__paste" role="alert">
          ✋ Este campo no admite pegar: escríbelo a mano.
        </p>
        <slot name="alert" />
        <div class="admin-form__actions confirm-steps__actions">
          <button type="button" class="confirm-steps__back" data-test="back" @click="emit('back')">← Atrás</button>
          <slot name="submit" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.confirm-steps {
  &__progress {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 1.25rem;
  }

  &__bar {
    flex: 1;
    height: 5px;
    border-radius: 999px;
    background: #e2e8f0;
    transition: background 0.3s;

    &--on { background: var(--color-orange, #f28c28); }
  }

  &__panel {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__done {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.7rem 0.9rem;
    border-radius: var(--radius);
    background: #ecfdf5;
    color: #065f46;
    font-size: 0.95rem;
  }

  &__change,
  &__back {
    padding: 0;
    border: 0;
    background: none;
    color: var(--color-navy);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  &__change { font-size: 0.875rem; text-decoration: underline; }
  &__back { margin-right: auto; }
  &__back:hover { text-decoration: underline; }

  &__actions { align-items: center; }

  &__paste {
    margin: -0.75rem 0 0;
    padding: 0.45rem 0.7rem;
    border-radius: 6px;
    background: #fef3c7;
    color: #78350f;
    font-size: 0.85rem;
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
