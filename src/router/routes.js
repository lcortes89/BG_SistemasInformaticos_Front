// Routes live in their own file so the tests can reuse them
// meta.overlayHeader: the page starts with a hero, so the transparent header floats over it
export const routes = [
  { path: '/', name: 'home', component: () => import('@/views/public/HomeView.vue'), meta: { overlayHeader: true } },
  { path: '/soluciones', name: 'solutions', component: () => import('@/views/public/SolutionsView.vue'), meta: { overlayHeader: true } },
  { path: '/tarifas', name: 'rates', component: () => import('@/views/public/RatesView.vue'), meta: { overlayHeader: true } },
  { path: '/clientes', name: 'clients', component: () => import('@/views/public/ClientsView.vue'), meta: { overlayHeader: true } },
  { path: '/contacto', name: 'contact', component: () => import('@/views/public/ContactView.vue'), meta: { hideDemoCta: true, overlayHeader: true } },
  { path: '/aviso-legal', name: 'legal-notice', component: () => import('@/views/public/LegalView.vue') },
  { path: '/privacidad', name: 'privacy', component: () => import('@/views/public/LegalView.vue') },
  { path: '/cookies', name: 'cookies', component: () => import('@/views/public/LegalView.vue') },
  // Admin area: reached by typing the URL, no public link
  { path: '/admin/login', name: 'admin-login', component: () => import('@/views/admin/AdminLoginView.vue'), meta: { hideDemoCta: true, hideNav: true } },
  // BGSI-273: forgot password (public: the admin cannot log in)
  { path: '/admin/olvide-contrasena', name: 'admin-forgot-password', component: () => import('@/views/admin/AdminForgotPasswordView.vue'), meta: { hideDemoCta: true, hideNav: true } },
  { path: '/admin/nueva-contrasena', name: 'admin-reset-password', component: () => import('@/views/admin/AdminResetPasswordView.vue'), meta: { hideDemoCta: true, hideNav: true } },
  // BGSI-301: link of "change my email" (public: it may be opened in any browser)
  { path: '/admin/confirmar-email', name: 'admin-confirm-email', component: () => import('@/views/admin/AdminConfirmEmailView.vue'), meta: { hideDemoCta: true, hideNav: true } },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true }, // the children inherit it
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboardView.vue') },
      { path: 'contactos', name: 'admin-contacts', component: () => import('@/views/admin/AdminContactsView.vue') },
      { path: 'marcas', name: 'admin-brands', component: () => import('@/views/admin/AdminBrandsView.vue') },
      { path: 'productos', name: 'admin-services', component: () => import('@/views/admin/AdminServicesView.vue') },
      { path: 'clientes', name: 'admin-clients', component: () => import('@/views/admin/AdminClientsView.vue') },
      { path: 'tarifas', name: 'admin-rates', component: () => import('@/views/admin/AdminRatesView.vue') },
      { path: 'administradores', name: 'admin-users', component: () => import('@/views/admin/AdminUsersView.vue') },
      // BGSI-272: the admin's own account (change password)
      { path: 'mi-cuenta', name: 'admin-account', component: () => import('@/views/admin/AdminAccountView.vue') },
      // BGSI-261: "Apariencia" is now "Ajustes" (the old address still works)
      // BGSI-297: "Ajustes" is split in two pages of the menu
      { path: 'foto-portada', name: 'admin-settings', component: () => import('@/views/admin/AdminSettingsView.vue') },
      { path: 'avisos-correo', name: 'admin-mail-settings', component: () => import('@/views/admin/AdminMailSettingsView.vue') },
      { path: 'ajustes', redirect: { name: 'admin-settings' } },
      { path: 'apariencia', redirect: { name: 'admin-settings' } },
    ],
  },
  // 404: any route that does not exist
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]
