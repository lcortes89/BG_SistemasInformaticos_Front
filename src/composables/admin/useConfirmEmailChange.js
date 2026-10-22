import { ref } from 'vue'
import AuthService from '@/core/apis/auth/AuthService'

// BGSI-301: the page of the link sent to the new email.
// state: 'loading' | 'done' | 'invalid' (used, expired or cancelled) | 'taken' (another admin uses it) | 'error'
export function useConfirmEmailChange(token, service = new AuthService(), onConfirmed = () => {}) {
  const state = ref(token ? 'loading' : 'invalid')
  const newEmail = ref(null)
  const errorMessage = ref(null)

  async function confirm() {
    if (!token) return
    state.value = 'loading'
    try {
      newEmail.value = await service.confirmEmailChange(token)
      onConfirmed(newEmail.value) // every session was closed: the local one too
      state.value = 'done'
    } catch (e) {
      if (e.status === 400) state.value = 'invalid'
      else if (e.status === 409) state.value = 'taken'
      else {
        errorMessage.value = e.message
        state.value = 'error'
      }
    }
  }

  return { state, newEmail, errorMessage, confirm }
}
