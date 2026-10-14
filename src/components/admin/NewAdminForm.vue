<script setup>
import { ref } from 'vue'
import { MIN_PASSWORD_LENGTH } from '@/composables/admin/useNewAdminForm'

// Presentational form: the state comes from useNewAdminForm (BGSI-197)
defineProps({
  form: { type: Object, required: true },
  errors: { type: Object, required: true },
  isSubmitting: { type: Boolean, default: false },
  submitError: { type: String, default: null },
})

const emit = defineEmits(['submit'])

// Eye button: shows or hides both passwords
const showPasswords = ref(false)
</script>

<template>
  <form class="admin-form" novalidate @submit.prevent="emit('submit')">
    <div class="admin-form__field">
      <label for="admin-email">Email *</label>
      <input id="admin-email" v-model="form.email" type="email" autocomplete="off"
             placeholder="nombre@bgsistemas.es" :aria-invalid="!!errors.email" />
      <p v-if="errors.email" class="admin-form__error">{{ errors.email }}</p>
    </div>

    <div class="admin-form__field">
      <label for="admin-password">Contraseña *</label>
      <input id="admin-password" v-model="form.password" :type="showPasswords ? 'text' : 'password'"
             autocomplete="new-password" :aria-invalid="!!errors.password" />
      <p v-if="errors.password" class="admin-form__error">{{ errors.password }}</p>
      <p v-else class="new-admin__hint">Mínimo {{ MIN_PASSWORD_LENGTH }} caracteres.</p>
    </div>

    <div class="admin-form__field">
      <label for="admin-confirm">Repite la contraseña *</label>
      <input id="admin-confirm" v-model="form.confirmPassword" :type="showPasswords ? 'text' : 'password'"
             autocomplete="new-password" :aria-invalid="!!errors.confirmPassword" />
      <p v-if="errors.confirmPassword" class="admin-form__error">{{ errors.confirmPassword }}</p>
    </div>

    <label class="admin-form__check">
      <input v-model="showPasswords" type="checkbox" data-test="show-passwords" />
      Mostrar contraseñas
    </label>

    <p v-if="submitError" class="admin-form__alert" role="alert">{{ submitError }}</p>

    <div class="admin-form__actions">
      <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Creando...' : 'Crear administrador' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.new-admin__hint { margin: 0; font-size: 0.85rem; color: var(--color-muted); }
</style>
