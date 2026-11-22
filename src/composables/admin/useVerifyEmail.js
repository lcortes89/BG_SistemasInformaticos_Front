import { ref } from 'vue'
import AuthService from '@/core/apis/auth/AuthService'

// BGSI-240: the page of the link that verifies the email of a new admin.
// state: 'loading' | 'done' | 'invalid' (used or expired) | 'error'
// resendState: 'idle' | 'sending' | 'sent' | 'error' (button "send me a new link")
export function useVerifyEmail(token, service = new AuthService()) {
  const state = ref(token ? 'loading' : 'invalid')
  const errorMessage = ref(null)
  const resendState = ref('idle')

  async function verify() {
    if (!token) return
    state.value = 'loading'
    try {
      await service.verifyEmail(token)
      state.value = 'done'
    } catch (e) {
      if (e.status === 400) state.value = 'invalid'
      else {
        errorMessage.value = e.message
        state.value = 'error'
      }
    }
  }

  // The backend answers 202 always: it never tells if the account exists
  async function resend() {
    resendState.value = 'sending'
    try {
      await service.resendVerification(token)
      resendState.value = 'sent'
    } catch {
      resendState.value = 'error'
    }
  }

  return { state, errorMessage, resendState, verify, resend }
}
