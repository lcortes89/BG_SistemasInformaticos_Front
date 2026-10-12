// Decides where a navigation goes. Returns true (go on) or the route to redirect to.
export function adminGuard(to, authStore) {
  if (to.meta.requiresAuth && !authStore.isAdmin) {
    // There was a session but its token expired: clear it and say why
    const expired = !!authStore.session && !authStore.isAuthenticated
    if (expired) authStore.logout()

    const query = { redirect: to.fullPath }
    if (expired) query.expired = '1'
    return { name: 'admin-login', query }
  }

  // An admin who is already logged in does not need the login page
  if (to.name === 'admin-login' && authStore.isAdmin) {
    return { name: 'admin-dashboard' }
  }

  return true
}
