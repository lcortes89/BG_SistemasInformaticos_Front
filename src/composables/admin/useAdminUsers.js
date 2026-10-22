import { ref } from 'vue'
import AdminUserService from '@/core/apis/adminuser/AdminUserService'

// The 409 of the backend: the admin changed meanwhile (e.g. another admin blocked it first)
const CONFLICT_MESSAGE = 'No se ha podido: el estado de este administrador ha cambiado. La lista se ha actualizado.'

// What each action does and the message shown when it works (BGSI-277)
const ACTIONS = {
  block: { call: (service, admin) => service.block(admin.id), done: (admin) => `${admin.email} está bloqueado. Ya no puede entrar al panel.` },
  unblock: { call: (service, admin) => service.unblock(admin.id), done: (admin) => `${admin.email} puede volver a entrar al panel.` },
  resetTwoFactor: {
    call: (service, admin) => service.resetTwoFactor(admin.id),
    done: (admin) => `Se ha quitado la verificación en dos pasos de ${admin.email}. Puede volver a activarla en Mi cuenta.`,
  },
  resendInvitation: {
    call: (service, admin) => service.resendInvitation(admin.id),
    done: (admin) => `Invitación reenviada a ${admin.email}. El enlace anterior ya no sirve.`,
  },
  remove: { call: (service, admin) => service.remove(admin.id), done: (admin) => `${admin.email} se ha borrado.` },
}

// "Administradores": the list and the actions on the other admins (BGSI-277)
export function useAdminUsers(service = new AdminUserService()) {
  const admins = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const feedback = ref(null)
  const actionError = ref(null)
  const busyId = ref(null) // the row whose action is running

  async function load() {
    isLoading.value = admins.value.length === 0 // a reload after an action keeps the table on screen
    error.value = null
    try {
      admins.value = await service.getAll()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  // action: a key of ACTIONS. Returns true when it worked
  async function run(action, admin) {
    feedback.value = null
    actionError.value = null
    busyId.value = admin.id
    try {
      await ACTIONS[action].call(service, admin)
      feedback.value = ACTIONS[action].done(admin)
      await load()
      return true
    } catch (e) {
      // BGSI-275: closing "Confirma tu contraseña" is not an error, nothing changes
      if (e.cancelled) return false
      if (e.status === 409 || e.status === 404) {
        actionError.value = CONFLICT_MESSAGE
        await load()
      } else {
        actionError.value = e.message
      }
      return false
    } finally {
      busyId.value = null
    }
  }

  // After the invitation form: the new admin appears in the list as "pending"
  async function invited(email) {
    actionError.value = null
    feedback.value = `Invitación enviada a ${email}. Tiene 24 horas para crear su contraseña.`
    await load()
  }

  return { admins, isLoading, error, feedback, actionError, busyId, load, run, invited }
}
