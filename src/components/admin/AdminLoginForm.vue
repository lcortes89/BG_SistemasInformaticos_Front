<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useLoginForm } from '@/composables/admin/useLoginForm'
import PasswordInput from '@/shared/PasswordInput.vue'

const props = defineProps({
  // Optional: lets the tests pass a fake auth store
  authStore: { type: Object, default: undefined },
})

const router = useRouter()
const route = useRoute()
const { form, errors, isSubmitting, submitError, submit } = useLoginForm(props.authStore)

async function handleSubmit() {
  const loggedIn = await submit()
  // Back to the page the admin wanted to open, or to the dashboard
  if (loggedIn) router.push(route.query.redirect || { name: 'admin-dashboard' })
}
</script>

<template>
  <form class="login-form" novalidate @submit.prevent="handleSubmit">
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
}
</style>
