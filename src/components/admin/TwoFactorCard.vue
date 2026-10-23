<script setup>
import { onMounted, ref } from 'vue'
import { useTwoFactorSettings } from '@/composables/admin/useTwoFactorSettings'

// BGSI-276: turn on / off the two-step verification of the logged-in admin
const props = defineProps({
  // Optional: lets the tests pass a fake AccountService and QR generator
  service: { type: Object, default: undefined },
  toQr: { type: Function, default: undefined },
  // BGSI-314: on its own page the title is already the one of the page (it stays for screen readers)
  hideTitle: { type: Boolean, default: false },
})

const {
  view, recoveryCodesLeft, setup, code, recoveryCodes, error, feedback, isBusy,
  load, start, confirm, cancelSetup, finish, disable, codesAsText,
} = useTwoFactorSettings(props.service, props.toQr)

const copied = ref(false)
const saved = ref(false)

onMounted(load)

async function copyCodes() {
  try {
    await navigator.clipboard.writeText(codesAsText())
    copied.value = true
    saved.value = true
  } catch {
    copied.value = false
  }
}

function downloadCodes() {
  const url = URL.createObjectURL(new Blob([codesAsText()], { type: 'text/plain' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'bg-sistemas-codigos-recuperacion.txt'
  link.click()
  URL.revokeObjectURL(url)
  saved.value = true
}

function done() {
  copied.value = false
  saved.value = false
  finish()
}
</script>

<template>
  <div class="two-factor">
    <div class="two-factor__head">
      <h2 class="two-factor__title" :class="{ 'sr-only': hideTitle }">Verificación en dos pasos</h2>
      <span v-if="view === 'on'" class="two-factor__badge two-factor__badge--on">Activada</span>
      <span v-else-if="view === 'off'" class="two-factor__badge">Desactivada</span>
    </div>

    <Transition name="slide-fade">
      <p v-if="feedback" class="two-factor__feedback" role="status">{{ feedback }}</p>
    </Transition>
    <Transition name="slide-fade">
      <p v-if="error" class="admin-form__alert" role="alert">{{ error }}</p>
    </Transition>

    <p v-if="view === 'loading'" class="two-factor__text">Cargando...</p>

    <!-- Off -->
    <template v-else-if="view === 'off'">
      <p class="two-factor__text">
        Además de la contraseña, al entrar te pediremos un <strong>código de 6 cifras</strong> de una app de tu móvil
        (Google Authenticator, Microsoft Authenticator...). Así, aunque alguien conozca tu contraseña, no podrá entrar.
      </p>
      <button type="button" class="btn btn--primary two-factor__main" :disabled="isBusy" data-test="start" @click="start">
        Activar verificación en dos pasos
      </button>
    </template>

    <!-- Step 1: QR + first code -->
    <form v-else-if="view === 'setup'" class="admin-form" novalidate @submit.prevent="confirm">
      <ol class="two-factor__steps">
        <li>Abre tu app de autenticación y pulsa <strong>«Añadir cuenta»</strong> o <strong>«+»</strong>.</li>
        <li>Escanea este código QR.</li>
      </ol>
      <div class="two-factor__qr">
        <img :src="setup.qr" alt="Código QR para añadir BG Sistemas a tu app de autenticación" width="180" height="180" />
        <div class="two-factor__secret">
          <p>¿No puedes escanearlo? Escribe esta clave en la app:</p>
          <code data-test="secret">{{ setup.secret.replace(/(.{4})/g, '$1 ').trim() }}</code>
        </div>
      </div>
      <div class="admin-form__field">
        <label for="two-factor-code">3. Escribe el código de 6 cifras que muestra la app</label>
        <input id="two-factor-code" v-model="code" type="text" inputmode="numeric" autocomplete="one-time-code"
               maxlength="6" placeholder="123456" class="two-factor__code" :aria-invalid="!!error" />
      </div>
      <div class="admin-form__actions">
        <button type="button" class="admin-form__cancel" @click="cancelSetup">Cancelar</button>
        <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isBusy">
          {{ isBusy ? 'Comprobando...' : 'Activar' }}
        </button>
      </div>
    </form>

    <!-- Step 2: recovery codes, shown only once -->
    <template v-else-if="view === 'codes'">
      <p class="two-factor__warning" role="alert">
        <strong>Guarda estos códigos ahora: no se volverán a mostrar.</strong>
        Si pierdes el móvil, podrás entrar con uno de ellos. Cada código sirve una sola vez.
      </p>
      <ul class="two-factor__codes" aria-label="Códigos de recuperación">
        <li v-for="item in recoveryCodes" :key="item"><code>{{ item }}</code></li>
      </ul>
      <div class="two-factor__code-actions">
        <button type="button" class="admin-form__cancel" data-test="copy" @click="copyCodes">
          {{ copied ? '✓ Copiados' : 'Copiar' }}
        </button>
        <button type="button" class="admin-form__cancel" data-test="download" @click="downloadCodes">Descargar .txt</button>
      </div>
      <button type="button" class="btn btn--primary two-factor__main" :disabled="!saved" data-test="done" @click="done">
        Ya los he guardado
      </button>
      <p v-if="!saved" class="two-factor__hint">Cópialos o descárgalos para continuar.</p>
    </template>

    <!-- On -->
    <template v-else>
      <p class="two-factor__text">
        Al entrar te pedimos el código de tu app. Te quedan
        <strong>{{ recoveryCodesLeft }} {{ recoveryCodesLeft === 1 ? 'código' : 'códigos' }} de recuperación</strong>.
      </p>
      <button type="button" class="admin-form__cancel two-factor__off" :disabled="isBusy" data-test="disable" @click="disable">
        Desactivar
      </button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.two-factor {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem; }
  &__title { margin: 0; font-size: 1.15rem; color: var(--color-navy); }

  &__badge {
    padding: 0.2rem 0.65rem;
    font-size: 0.8rem;
    font-weight: 700;
    border-radius: 999px;
    color: #4b5563;
    background: #f3f4f6;

    &--on { color: #065f46; background: #d1fae5; }
  }

  &__text { margin: 0; color: #374151; line-height: 1.55; }
  &__feedback { margin: 0; padding: 0.8rem 1rem; border-radius: var(--radius); color: #065f46; background: #ecfdf5; }
  &__main { align-self: flex-start; font: inherit; font-weight: 600; }
  &__off { align-self: flex-start; color: #b91c1c !important; }

  &__steps { margin: 0; padding-left: 1.2rem; color: #374151; line-height: 1.6; }

  &__qr {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;
    padding: 1rem;
    border-radius: var(--radius);
    background: var(--color-bg-alt);

    img { display: block; border-radius: 8px; background: #fff; }
  }

  &__secret {
    flex: 1;
    min-width: 180px;

    p { margin: 0 0 0.4rem; font-size: 0.875rem; color: #4b5563; }
    code { font-size: 0.95rem; font-weight: 700; color: var(--color-navy); word-break: break-all; }
  }

  &__code {
    max-width: 220px;
    font-size: 1.4rem !important;
    letter-spacing: 0.4em;
    text-align: center;
  }

  &__warning {
    margin: 0;
    padding: 0.9rem 1rem;
    border-radius: var(--radius);
    color: #78350f;
    background: #fef3c7;
    line-height: 1.5;

    strong { display: block; margin-bottom: 0.2rem; }
  }

  &__codes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
    margin: 0;
    padding: 1rem;
    list-style: none;
    border: 1px dashed #cbd5e1;
    border-radius: var(--radius);

    code { font-size: 1.05rem; font-weight: 700; letter-spacing: 0.05em; color: var(--color-navy); }
  }

  &__code-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
  &__hint { margin: -0.5rem 0 0; font-size: 0.85rem; color: #6b7280; }
}
</style>
