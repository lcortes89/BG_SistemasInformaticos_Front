<script setup>
import { RouterLink } from 'vue-router'
import RowActionsMenu from '@/shared/RowActionsMenu.vue'

defineProps({
  admins: { type: Array, required: true }, // AdminUserModel[]
  busyId: { type: Number, default: null }, // the row whose action is running
})

// action: (actionName, admin) -> the view asks "¿Seguro?" first
const emit = defineEmits(['action'])

// BGSI-312: the actions of each row, in the "⋯" menu (only the ones that make sense for its status)
function actionsFor(admin) {
  const items = []
  if (admin.isPending()) items.push({ key: 'resendInvitation', label: 'Reenviar invitación', icon: 'mail' })
  if (admin.isActive()) items.push({ key: 'block', label: 'Bloquear', icon: 'lock' })
  if (admin.isBlocked()) items.push({ key: 'unblock', label: 'Desbloquear', icon: 'unlock' })
  if (admin.twoFactorEnabled) items.push({ key: 'resetTwoFactor', label: 'Quitar doble verificación', icon: 'shield' })
  items.push({ key: 'remove', label: 'Borrar', icon: 'trash', danger: true })
  return items
}
</script>

<template>
  <table class="admin-table admin-users-table">
    <thead>
      <tr>
        <th scope="col">Administrador</th>
        <th scope="col">Estado</th>
        <th scope="col">Doble verificación</th>
        <th scope="col">Último acceso</th>
        <th scope="col" class="row-actions-cell"><span class="sr-only">Acciones</span></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="admin in admins" :key="admin.id" :class="{ 'admin-users-table__row--you': admin.you }"
          :data-test="`admin-${admin.id}`">
        <td data-label="Administrador">
          <div class="admin-table__identity">
            <span class="admin-table__initials" aria-hidden="true">{{ admin.getInitials() }}</span>
            <div class="admin-users-table__who">
              <!-- <wbr>: on a narrow screen the email breaks before the @, not in the middle of a word -->
              <strong class="admin-users-table__email">{{ admin.email.split('@')[0] }}<wbr>@{{ admin.email.split('@')[1] }}</strong>
              <span v-if="admin.you" class="admin-users-table__you">Tú</span>
            </div>
          </div>
        </td>
        <td data-label="Estado">
          <span class="admin-table__badge" :class="`admin-users-table__badge--${admin.status.toLowerCase()}`">
            {{ admin.getStatusLabel() }}
          </span>
        </td>
        <td data-label="Doble verificación">
          <span v-if="admin.twoFactorEnabled" class="admin-users-table__2fa admin-users-table__2fa--on">✓ Activada</span>
          <span v-else class="admin-users-table__2fa">No activada</span>
        </td>
        <td data-label="Último acceso" class="admin-users-table__date">{{ admin.getLastLogin() }}</td>
        <td v-if="admin.you" data-label="Acciones" class="admin-users-table__own-cell">
          <RouterLink :to="{ name: 'admin-account' }" class="admin-users-table__own">Ir a Mi cuenta →</RouterLink>
        </td>
        <td v-else class="row-actions-cell">
          <RowActionsMenu :items="actionsFor(admin)" :label="`Acciones de ${admin.email}`"
                          :disabled="busyId === admin.id" @select="emit('action', $event, admin)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.admin-users-table {
  &__row--you td { background: #fffaf3; }

  &__who { display: flex; flex-direction: column; align-items: flex-start; gap: 0.2rem; min-width: 0; }

  &__email { overflow-wrap: anywhere; }

  &__date { min-width: 6.5rem; }

  &__you {
    padding: 0.1rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-navy);
    background: #fde7cf;
    border-radius: 999px;
  }

  &__badge--active { color: #14532d; background: #dcfce7; }
  &__badge--pending { color: #78350f; background: #fef3c7; }
  &__badge--blocked { color: #7f1d1d; background: #fee2e2; }

  &__2fa { font-size: 0.9rem; color: var(--color-muted); }
  &__2fa--on { font-weight: 600; color: #15803d; }

  &__own-cell { white-space: nowrap; text-align: right !important; }

  &__own { font-size: 0.9rem; font-weight: 600; color: var(--color-navy); }
}
</style>
