import { STORAGE_KEY } from '@/stores/auth'

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
      router.push({ name: 'admin-login', query: { loggedOut: '1' } })
    }
  }

  target.addEventListener('storage', onStorageChange)
  // Returns a function to stop listening (useful in the tests)
  return () => target.removeEventListener('storage', onStorageChange)
}
