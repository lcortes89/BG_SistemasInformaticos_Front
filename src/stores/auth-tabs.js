import { STORAGE_KEY } from '@/stores/auth'
import { LOGOUT_REASON_KEY } from '@/core/config/session'

// Keeps every tab of the browser with the same session (BGSI-257).
// The browser fires "storage" in the OTHER tabs when one tab changes localStorage,
// so when the admin logs out in one tab, the rest find out and go to the login.
export function syncSessionBetweenTabs(authStore, router, target = window) {
  function onStorageChange(event) {
    // key = null means localStorage.clear() (e.g. "delete site data")
    if (event.key !== null && event.key !== STORAGE_KEY) return

    const wasAdmin = authStore.isAdmin
    authStore.syncFromStorage()

    if (wasAdmin && !authStore.isAdmin && router.currentRoute.value.meta.requiresAuth) {
      // BGSI-268: if the other tab closed the session for inactivity, say that (not "another tab")
      const query = readLogoutReason() === 'idle' ? { reason: 'idle' } : { loggedOut: '1' }
      router.push({ name: 'admin-login', query })
    }
  }

  function readLogoutReason() {
    try {
      return localStorage.getItem(LOGOUT_REASON_KEY)
    } catch {
      return null
    }
  }

  target.addEventListener('storage', onStorageChange)
  // Returns a function to stop listening (useful in the tests)
  return () => target.removeEventListener('storage', onStorageChange)
}
