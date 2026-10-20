import { defineStore } from 'pinia'
import { ref } from 'vue'

// BGSI-275: password typed again before a sensitive action (delete, contact email, new admin).
// The backend gives a token valid for 5 minutes; it is kept only in memory (never in localStorage)
// and only for the admin who confirmed. While it is valid the password is not asked again.
export const CONFIRM_HEADER = 'X-Confirm-Token'

export function cancelledError() {
  const error = new Error('Acción cancelada')
  error.cancelled = true
  return error
}

export const useConfirmationStore = defineStore('confirmation', () => {
  const token = ref(null)
  const email = ref(null)
  const expiresAt = ref(0)
  const isOpen = ref(false)
  let waiting = [] // requests waiting for the dialog: { resolve, reject }

  // The token, only if it is still valid and belongs to the logged-in admin
  function validToken(currentEmail, now = Date.now()) {
    if (!token.value || now >= expiresAt.value) return null
    return email.value === currentEmail ? token.value : null
  }

  // Opens the dialog. Resolves with the token when the password is right, rejects if cancelled
  function request() {
    isOpen.value = true
    return new Promise((resolve, reject) => waiting.push({ resolve, reject }))
  }

  function confirmed(newToken, expiresInSeconds, adminEmail, now = Date.now()) {
    token.value = newToken
    email.value = adminEmail
    expiresAt.value = now + expiresInSeconds * 1000
    isOpen.value = false
    waiting.forEach(({ resolve }) => resolve(newToken))
    waiting = []
  }

  function cancel() {
    isOpen.value = false
    waiting.forEach(({ reject }) => reject(cancelledError()))
    waiting = []
  }

  function clear() {
    token.value = null
    email.value = null
    expiresAt.value = 0
  }

  return { isOpen, validToken, request, confirmed, cancel, clear }
})
