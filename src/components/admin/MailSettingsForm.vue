<script setup>
import { onMounted } from 'vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import AdminSettingService from '@/core/apis/setting/AdminSettingService'
import { useAdminMailSettings } from '@/composables/admin/useAdminMailSettings'

// "✉️ Avisos por correo" card of the Ajustes screen (BGSI-261)
const props = defineProps({
  // Optional: lets the tests pass a fake service
  service: { type: Object, default: () => new AdminSettingService() },
})

const {
  saved, form, isLoading, isSaving, isSendingTest, error, feedback,
  emailChanged, confirmError, hasChanges, canSave, load, save, sendTest,
} = useAdminMailSettings(props.service)

onMounted(load)
</script>

<template>
  <section class="mail-settings" aria-labelledby="mail-settings-title">
    <h2 id="mail-settings-title" class="mail-settings__title">✉️ Avisos por correo</h2>
    <p class="mail-settings__intro">
      Cada vez que alguien rellena el formulario de Contacto, te enviamos un correo con sus datos.
    </p>

    <LoadingSpinner v-if="isLoading" label="Cargando avisos por correo..." />

    <form v-else-if="saved" class="admin-form" novalidate @submit.prevent="save">
      <div class="mail-settings__grid">
        <div class="admin-form__field">
          <label for="mail-notify-email">Email que recibe los contactos *</label>
          <input id="mail-notify-email" v-model="form.notifyEmail" type="email" autocomplete="email" maxlength="255" />
          <small class="mail-settings__hint">
            Ahora: {{ saved.notifyEmail || '—' }} · Puede ser el del dueño o el de un empleado.
          </small>
        </div>

        <!-- Only when the recipient changes. No paste or drop: the admin types it again by hand -->
        <div v-if="emailChanged" class="admin-form__field">
          <label for="mail-confirm-email">Repite el nuevo email *</label>
          <input id="mail-confirm-email" v-model="form.confirmEmail" type="email" autocomplete="off" maxlength="255"
                 :aria-invalid="!!confirmError" aria-describedby="mail-confirm-error"
                 @paste.prevent @drop.prevent />
          <p v-if="confirmError" id="mail-confirm-error" class="admin-form__error" role="alert">{{ confirmError }}</p>
        </div>

        <div class="admin-form__field">
          <label for="mail-sender-name">Nombre del remitente</label>
          <input id="mail-sender-name" v-model="form.senderName" type="text" maxlength="60" />
          <small class="mail-settings__hint">Es el nombre que verás en la bandeja de entrada.</small>
        </div>
      </div>

      <p class="mail-settings__lock">
        🔒 Los correos se envían desde <strong>{{ saved.senderAccount || 'la cuenta del servidor' }}</strong>.
        Esa cuenta y su contraseña se configuran en el servidor por seguridad.
      </p>

      <Transition name="slide-fade">
        <p v-if="feedback" class="admin-page__feedback" role="status">{{ feedback }}</p>
      </Transition>
      <p v-if="error" class="admin-form__alert" role="alert">{{ error }}</p>

      <div class="admin-form__actions">
        <button type="button" class="mail-settings__test" :disabled="hasChanges || isSendingTest"
                :title="hasChanges ? 'Guarda los cambios antes de enviar la prueba' : null" @click="sendTest">
          {{ isSendingTest ? 'Enviando...' : 'Enviar correo de prueba' }}
        </button>
        <button type="submit" class="btn btn--primary admin-form__submit" :disabled="!canSave">
          {{ isSaving ? 'Guardando...' : 'Guardar avisos' }}
        </button>
      </div>
    </form>

    <p v-else-if="error" class="admin-form__alert" role="alert">{{ error }}</p>
  </section>
</template>

<style scoped lang="scss">
.mail-settings {
  max-width: 1000px;
  margin-bottom: 2rem;
  padding: 1.75rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(11, 31, 58, 0.08);

  &__title { margin: 0 0 0.25rem; font-size: 1.2rem; color: var(--color-navy); }
  &__intro { margin: 0 0 1.25rem; color: var(--color-muted); }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
    align-items: start;
  }

  &__hint { color: var(--color-muted); font-size: 0.8rem; }

  &__lock {
    margin: 0;
    padding: 0.75rem 1rem;
    border-radius: var(--radius);
    background: #f1f5f9;
    color: #475569;
    font-size: 0.9rem;
  }

  &__test {
    padding: 0.65rem 1rem;
    border: 1px solid var(--color-navy);
    border-radius: var(--radius);
    background: #fff;
    color: var(--color-navy);
    font: inherit;
    font-weight: 600;
    cursor: pointer;

    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  .admin-page__feedback { margin: 0; }
}

@media (max-width: 700px) {
  .mail-settings__grid { grid-template-columns: 1fr; }
  .admin-form__actions { flex-wrap: wrap; }
}
</style>
