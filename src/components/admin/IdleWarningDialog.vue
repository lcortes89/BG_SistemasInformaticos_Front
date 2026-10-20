<script setup>
import { computed, onMounted, ref } from 'vue'

// BGSI-268: "¿Sigues ahí?" 30 seconds before the session is closed for inactivity
const props = defineProps({
  secondsLeft: { type: Number, required: true },
  totalSeconds: { type: Number, default: 30 },
})

const emit = defineEmits(['stay', 'logout'])

const stayButton = ref(null)
onMounted(() => stayButton.value?.focus())

// Screen readers hear the time at 30, 20, 10 and 5 s (not every second, it would be too noisy)
const announcement = computed(() =>
  [30, 20, 10, 5].includes(props.secondsLeft) ? `Quedan ${props.secondsLeft} segundos` : '')
const progress = computed(() => Math.max(0, Math.min(100, (props.secondsLeft / props.totalSeconds) * 100)))
</script>

<template>
  <div class="idle-warning">
    <div class="idle-warning__box" role="alertdialog" aria-modal="true"
         aria-labelledby="idle-warning-title" aria-describedby="idle-warning-text">
      <p class="idle-warning__icon" aria-hidden="true">⏳</p>
      <h2 id="idle-warning-title">¿Sigues ahí?</h2>
      <p id="idle-warning-text">
        Tu sesión se cerrará en <strong class="idle-warning__seconds">{{ secondsLeft }} s</strong> por inactividad.
      </p>
      <div class="idle-warning__bar" aria-hidden="true">
        <span :style="{ width: `${progress}%` }" />
      </div>
      <p class="visually-hidden" aria-live="polite">{{ announcement }}</p>

      <div class="idle-warning__actions">
        <button type="button" class="idle-warning__logout" @click="emit('logout')">Cerrar sesión ahora</button>
        <button ref="stayButton" type="button" class="btn btn--primary idle-warning__stay" @click="emit('stay')">
          Seguir conectada
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.idle-warning {
  position: fixed;
  inset: 0;
  z-index: 300;
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
    text-align: center;

    h2 { margin: 0 0 0.5rem; font-size: 1.35rem; color: var(--color-navy); }
    p { margin: 0 0 1rem; color: #374151; }
  }

  &__icon { font-size: 2.2rem; margin-bottom: 0.25rem !important; }
  &__seconds { color: #b45309; font-variant-numeric: tabular-nums; }

  &__bar {
    height: 6px;
    margin-bottom: 1.5rem;
    overflow: hidden;
    border-radius: 999px;
    background: #fde7cf;

    span {
      display: block;
      height: 100%;
      background: var(--color-orange);
      transition: width 1s linear;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap-reverse;
    justify-content: center;
    gap: 0.75rem 1.25rem;
  }

  &__logout {
    padding: 0;
    border: 0;
    background: none;
    color: var(--color-navy);
    font: inherit;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
  }

  &__stay { font: inherit; font-weight: 600; }
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
