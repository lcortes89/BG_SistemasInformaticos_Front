<script setup>
import { ref } from 'vue'

// BGSI-267: password field with an eye button to show or hide what was typed.
// v-model works like on a normal <input>; the other attributes (id, autocomplete, aria-*) go to the <input>
defineOptions({ inheritAttrs: false })

const model = defineModel({ type: String, default: '' })
const isVisible = ref(false)
</script>

<template>
  <div class="password-input">
    <input v-bind="$attrs" v-model="model" :type="isVisible ? 'text' : 'password'" class="password-input__field" />
    <button type="button" class="password-input__toggle" :aria-pressed="isVisible"
            :aria-label="isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            :title="isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="isVisible = !isVisible">
      <!-- Eye crossed out = the password is visible, click to hide it -->
      <svg v-if="isVisible" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 3l18 18" />
        <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c5 0 9 4.5 10 7a12.6 12.6 0 0 1-3.2 4.3" />
        <path d="M6.6 6.6C4.4 8 2.8 10 2 12c1 2.5 5 7 10 7 1.9 0 3.6-.6 5.1-1.5" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 12c1-2.5 5-7 10-7s9 4.5 10 7c-1 2.5-5 7-10 7S3 14.5 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.password-input {
  position: relative;
  display: flex;

  &__field {
    flex: 1;
    width: 100%;
    padding-right: 2.75rem !important; // room for the eye button
  }

  &__toggle {
    position: absolute;
    top: 50%;
    right: 0.4rem;
    display: grid;
    place-items: center;
    width: 2.1rem;
    height: 2.1rem;
    padding: 0;
    color: #6b7280;
    background: none;
    border: none;
    border-radius: var(--radius);
    transform: translateY(-50%);
    cursor: pointer;

    &:hover { color: var(--color-navy); }
    &:focus-visible { outline: 2px solid var(--color-orange); outline-offset: 1px; }

    svg {
      width: 1.25rem;
      height: 1.25rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
}
</style>
