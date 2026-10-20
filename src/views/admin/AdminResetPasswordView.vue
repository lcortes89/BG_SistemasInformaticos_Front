<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AuthPageCard from '@/components/admin/AuthPageCard.vue'
import PasswordInput from '@/shared/PasswordInput.vue'
import { useResetPasswordForm } from '@/composables/admin/usePasswordResetForms'

const props = defineProps({
  // Optional: lets the tests pass a fake AuthService
  authService: { type: Object, default: undefined },
})

const route = useRoute()
const router = useRouter()
// /admin/nueva-contrasena?token=... (the link of the email)
const token = typeof route.query.token === 'string' ? route.query.token : ''

const { form, errors, rules, isSubmitting, submitError, isInvalidLink, submit } =
  useResetPasswordForm(token, props.authService)

async function handleSubmit() {
  if (await submit()) router.push({ name: 'admin-login', query: { reset: '1' } })
}
</script>

<template>
  <AuthPageCard title="Crea una nueva contraseña"
                :subtitle="isInvalidLink ? '' : 'Elige una contraseña segura que no uses en otras webs.'">
    <div v-if="isInvalidLink" class="reset-invalid" role="alert">
      <p><strong>El enlace no es válido o ha caducado.</strong></p>
      <p>Los enlaces solo sirven una vez y durante 30 minutos.</p>
      <RouterLink :to="{ name: 'admin-forgot-password' }" class="btn btn--primary">Pedir un enlace nuevo</RouterLink>
    </div>

    <form v-else class="admin-form" novalidate @submit.prevent="handleSubmit">
      <div class="admin-form__field">
        <label for="reset-new">Nueva contraseña</label>
        <PasswordInput id="reset-new" v-model="form.newPassword" autocomplete="new-password"
                       :aria-invalid="!!errors.newPassword" aria-describedby="reset-rules reset-new-error" />
        <p v-if="errors.newPassword" id="reset-new-error" class="admin-form__error">{{ errors.newPassword }}</p>
        <ul id="reset-rules" class="password-rules" aria-label="Requisitos de la contraseña">
          <li v-for="rule in rules" :key="rule.key" class="password-rules__item"
              :class="{ 'password-rules__item--ok': rule.ok }" :data-rule="rule.key">
            <span aria-hidden="true">{{ rule.ok ? '✓' : '•' }}</span> {{ rule.label }}
          </li>
        </ul>
      </div>

      <div class="admin-form__field">
        <label for="reset-confirm">Repite la nueva contraseña</label>
        <PasswordInput id="reset-confirm" v-model="form.confirmPassword" autocomplete="new-password"
                       :aria-invalid="!!errors.confirmPassword" aria-describedby="reset-confirm-error" />
        <p v-if="errors.confirmPassword" id="reset-confirm-error" class="admin-form__error">{{ errors.confirmPassword }}</p>
      </div>

      <p v-if="submitError" class="admin-form__alert" role="alert">{{ submitError }}</p>

      <button type="submit" class="btn btn--primary auth-submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Guardando...' : 'Guardar contraseña' }}
      </button>
    </form>
  </AuthPageCard>
</template>

<style scoped lang="scss">
.auth-submit { width: 100%; font: inherit; font-weight: 600; }

.password-rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem 1rem;
  margin: 0.35rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.85rem;

  &__item {
    color: var(--color-muted);
    &--ok { color: #15803d; font-weight: 600; }
  }
}

.reset-invalid {
  padding: 1.25rem;
  border-radius: var(--radius);
  background: #fef2f2;
  color: #7f1d1d;
  text-align: center;

  p { margin: 0 0 0.6rem; }
  .btn { margin-top: 0.5rem; text-decoration: none; }
}
</style>
