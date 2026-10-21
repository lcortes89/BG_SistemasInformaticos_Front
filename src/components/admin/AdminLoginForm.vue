<script setup>
import { nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useLoginForm } from '@/composables/admin/useLoginForm'
import PasswordInput from '@/shared/PasswordInput.vue'

const props = defineProps({
  // Optional: lets the tests pass a fake auth store
  authStore: { type: Object, default: undefined },
})

const router = useRouter()
const route = useRoute()
const {
  form, errors, isSubmitting, submitError, submit,
  step, useRecoveryCode, submitCode, backToPassword, toggleRecoveryCode,
} = useLoginForm(props.authStore)

const codeInput = ref(null)

function goToPanel() {
  // Back to the page the admin wanted to open, or to the dashboard
  router.push(route.query.redirect || { name: 'admin-dashboard' })
}

async function handleSubmit() {
  if (await submit()) goToPanel()
}

async function handleCode() {
  if (await submitCode()) goToPanel()
  else codeInput.value?.focus()
}

// BGSI-276: the cursor goes to the code field when the second step appears (or changes)
watch([step, useRecoveryCode], async () => {
  await nextTick()
  if (step.value === 'code') codeInput.value?.focus()
})
</script>

<template>
  <form v-if="step === 'password'" class="login-form" novalidate @submit.prevent="handleSubmit">
    <div class="login-form__field">
      <label for="login-email">Email</label>
      <input id="login-email" v-model="form.email" type="email" autocomplete="username"
             :aria-invalid="!!errors.email" aria-describedby="login-email-error" />
      <Transition name="slide-fade">
        <p v-if="errors.email" id="login-email-error" class="login-form__error">{{ errors.email }}</p>
      </Transition>
    </div>

    <div class="login-form__field">
      <label for="login-password">Contraseña</label>
      <PasswordInput id="login-password" v-model="form.password" autocomplete="current-password"
             :aria-invalid="!!errors.password" aria-describedby="login-password-error" />
      <Transition name="slide-fade">
        <p v-if="errors.password" id="login-password-error" class="login-form__error">{{ errors.password }}</p>
      </Transition>
      <!-- BGSI-273 -->
      <RouterLink :to="{ name: 'admin-forgot-password' }" class="login-form__forgot">¿Olvidaste tu contraseña?</RouterLink>
    </div>

    <Transition name="slide-fade">
      <p v-if="submitError" class="login-form__alert" role="alert">{{ submitError }}</p>
    </Transition>

    <button type="submit" class="btn btn--primary login-form__submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
    </button>
  </form>

  <!-- BGSI-276: second step, the code of the authenticator app -->
  <form v-else class="login-form" novalidate data-test="code-step" @submit.prevent="handleCode">
    <div class="login-form__step">
      <span class="login-form__step-icon" aria-hidden="true">📱</span>
      <div>
        <h2>Verificación en dos pasos</h2>
        <p v-if="useRecoveryCode">Escribe uno de tus <strong>códigos de recuperación</strong>. Cada código sirve una sola vez.</p>
        <p v-else>Abre tu app de autenticación y escribe el <strong>código de 6 cifras</strong> de BG Sistemas.</p>
      </div>
    </div>

    <div class="login-form__field">
      <label for="login-code">{{ useRecoveryCode ? 'Código de recuperación' : 'Código de la app' }}</label>
      <input id="login-code" ref="codeInput" v-model="form.code" type="text" autocomplete="one-time-code"
             :inputmode="useRecoveryCode ? 'text' : 'numeric'" :maxlength="useRecoveryCode ? 9 : 6"
             :placeholder="useRecoveryCode ? 'xxxx-xxxx' : '123456'"
             :class="{ 'login-form__code': !useRecoveryCode }"
             :aria-invalid="!!errors.code" aria-describedby="login-code-error" />
      <Transition name="slide-fade">
        <p v-if="errors.code" id="login-code-error" class="login-form__error" role="alert">{{ errors.code }}</p>
      </Transition>
      <button type="button" class="login-form__link" data-test="toggle-recovery" @click="toggleRecoveryCode">
        {{ useRecoveryCode ? 'Usar el código de la app' : '¿No tienes el móvil? Usa un código de recuperación' }}
      </button>
    </div>

    <Transition name="slide-fade">
      <p v-if="submitError" class="login-form__alert" role="alert">{{ submitError }}</p>
    </Transition>

    <button type="submit" class="btn btn--primary login-form__submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Comprobando...' : 'Verificar y entrar' }}
    </button>
    <button type="button" class="login-form__back" data-test="back-to-password" @click="backToPassword()">
      ← Volver al email y la contraseña
    </button>
  </form>
</template>

<style scoped lang="scss">
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &__field { display: flex; flex-direction: column; gap: 0.35rem; }

  label { font-weight: 600; color: var(--color-navy); }

  :deep(input) { // also the input inside PasswordInput (BGSI-267)
    padding: 0.7rem 0.9rem;
    font: inherit;
    border: 1px solid #d1d5db;
    border-radius: var(--radius);

    &:focus { outline: 2px solid var(--color-orange); outline-offset: 1px; }
    &[aria-invalid='true'] { border-color: #b91c1c; }
  }

  &__error { margin: 0; font-size: 0.875rem; color: #b91c1c; }

  &__forgot {
    align-self: flex-end;
    font-size: 0.875rem;
    color: var(--color-navy);
    text-decoration: none;

    &:hover { text-decoration: underline; }
  }

  &__alert {
    margin: 0;
    padding: 0.9rem 1rem;
    border-radius: var(--radius);
    color: #7f1d1d;
    background: #fee2e2;
  }

  &__submit {
    width: 100%;
    font: inherit;
    font-weight: 600;

    &:disabled { opacity: 0.7; cursor: not-allowed; }
  }

  // BGSI-276: second step
  &__step {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
    padding: 1rem;
    border-radius: var(--radius);
    background: var(--color-bg-alt);

    h2 { margin: 0 0 0.25rem; font-size: 1.05rem; color: var(--color-navy); }
    p { margin: 0; font-size: 0.925rem; color: #374151; line-height: 1.45; }
  }

  &__step-icon { font-size: 1.6rem; line-height: 1; }

  &__code {
    font-size: 1.5rem !important;
    letter-spacing: 0.5em;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  &__link,
  &__back {
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-size: 0.875rem;
    color: var(--color-navy);
    text-decoration: underline;
    cursor: pointer;
  }

  &__link { align-self: flex-start; margin-top: 0.25rem; }
  &__back { align-self: center; text-decoration: none; font-weight: 600; }
}
</style>
