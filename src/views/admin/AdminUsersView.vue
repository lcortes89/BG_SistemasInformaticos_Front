<script setup>
import { computed, onMounted, ref } from 'vue'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import ModalDialog from '@/shared/ModalDialog.vue'
import ConfirmDialog from '@/shared/ConfirmDialog.vue'
import AdminUsersTable from '@/components/admin/AdminUsersTable.vue'
import InviteAdminForm from '@/components/admin/InviteAdminForm.vue'
import { useAdminUsers } from '@/composables/admin/useAdminUsers'
import { useInviteAdminForm } from '@/composables/admin/useInviteAdminForm'

const props = defineProps({
  // Optional: lets the tests pass a fake AdminUserService
  service: { type: Object, default: undefined },
})

const { admins, isLoading, error, feedback, actionError, busyId, load, run, invited } = useAdminUsers(props.service)
const invite = useInviteAdminForm(props.service)

// BGSI-277: the "¿Seguro?" of each action. After it, the backend asks for the password (BGSI-275)
const QUESTIONS = {
  block: (email) => ({
    title: 'Bloquear administrador',
    message: `${email} no podrá entrar al panel y se cerrarán sus sesiones abiertas. Podrás desbloquearlo cuando quieras.`,
    confirmLabel: 'Bloquear',
  }),
  unblock: (email) => ({
    title: 'Desbloquear administrador',
    message: `${email} podrá volver a entrar al panel con su contraseña.`,
    confirmLabel: 'Desbloquear',
  }),
  resetTwoFactor: (email) => ({
    title: 'Quitar la verificación en dos pasos',
    message: `Úsalo solo si ${email} ha perdido el móvil y sus códigos de recuperación. Podrá entrar solo con su contraseña y volver a activarla en Mi cuenta.`,
    confirmLabel: 'Quitar verificación',
  }),
  resendInvitation: (email) => ({
    title: 'Reenviar invitación',
    message: `Se enviará un enlace nuevo a ${email}, válido 24 horas. El enlace anterior dejará de servir.`,
    confirmLabel: 'Reenviar',
  }),
  remove: (email) => ({
    title: 'Borrar administrador',
    message: `¿Seguro que quieres borrar a ${email}? Perderá el acceso al panel y esta acción no se puede deshacer.`,
    confirmLabel: 'Borrar',
  }),
}

const pending = ref(null) // { action, admin } waiting for "¿Seguro?"
const question = computed(() => pending.value && QUESTIONS[pending.value.action](pending.value.admin.email))

async function confirmAction() {
  const { action, admin } = pending.value
  pending.value = null
  await run(action, admin)
}

const inviteOpen = ref(false)

function openInvite() {
  invite.reset()
  inviteOpen.value = true
}

async function sendInvitation() {
  const email = await invite.submit()
  if (!email) return
  inviteOpen.value = false
  await invited(email)
}

const countLabel = computed(() => `${admins.value.length} ${admins.value.length === 1 ? 'administrador' : 'administradores'}`)

onMounted(load)
</script>

<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>Administradores</h1>
        <p>{{ countLabel }}</p>
      </div>
      <div class="admin-page__tools">
        <button type="button" class="btn btn--primary admin-page__new" @click="openInvite">+ Invitar administrador</button>
      </div>
    </header>

    <p class="admin-users__info">
      🛡️ Todos los administradores tienen <strong>los mismos permisos</strong>. Cada cambio te pide tu contraseña
      y se avisa por correo a todos los administradores.
    </p>

    <Transition name="slide-fade">
      <p v-if="feedback" class="admin-page__feedback" role="status">{{ feedback }}</p>
    </Transition>
    <Transition name="slide-fade">
      <p v-if="actionError" class="admin-page__error" role="alert">{{ actionError }}</p>
    </Transition>

    <LoadingSpinner v-if="isLoading" label="Cargando administradores..." />
    <p v-else-if="error" class="admin-page__error" role="alert">{{ error }}</p>
    <AdminUsersTable v-else :admins="admins" :busy-id="busyId" @action="(action, admin) => (pending = { action, admin })" />

    <Transition name="slide-fade">
      <ModalDialog v-if="inviteOpen" title="Invitar administrador" @close="inviteOpen = false">
        <InviteAdminForm :form="invite.form" :errors="invite.errors" :step="invite.step.value"
                         :paste-blocked="invite.pasteBlocked.value" :is-submitting="invite.isSubmitting.value"
                         :submit-error="invite.submitError.value"
                         @continue="invite.next" @back="invite.back" @blocked-paste="invite.blockPaste"
                         @submit="sendInvitation" @cancel="inviteOpen = false" />
      </ModalDialog>
    </Transition>

    <Transition name="slide-fade">
      <ConfirmDialog v-if="question" :title="question.title" :message="question.message"
                     :confirm-label="question.confirmLabel" @confirm="confirmAction" @cancel="pending = null" />
    </Transition>
  </section>
</template>

<style scoped>
.admin-users__info {
  margin: 0 0 1.25rem;
  padding: 0.85rem 1rem;
  border-radius: var(--radius);
  background: #eef4fb;
  color: var(--color-navy);
  line-height: 1.5;
}
</style>
