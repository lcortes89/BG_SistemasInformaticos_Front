// Routes live in their own file so the tests can reuse them
export const routes = [
  { path: '/', name: 'home', component: () => import('@/views/public/HomeView.vue') },
  { path: '/soluciones', name: 'solutions', component: () => import('@/views/public/SolutionsView.vue') },
  { path: '/tarifas', name: 'rates', component: () => import('@/views/public/RatesView.vue') },
  { path: '/clientes', name: 'clients', component: () => import('@/views/public/ClientsView.vue') },
  { path: '/contacto', name: 'contact', component: () => import('@/views/public/ContactView.vue') },
  { path: '/aviso-legal', name: 'legal-notice', component: () => import('@/views/public/LegalView.vue') },
  { path: '/privacidad', name: 'privacy', component: () => import('@/views/public/LegalView.vue') },
  { path: '/cookies', name: 'cookies', component: () => import('@/views/public/LegalView.vue') },
  // Admin area: reached by typing the URL, no public link
  { path: '/admin/login', name: 'admin-login', component: () => import('@/views/admin/AdminLoginView.vue') },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/AdminDashboardView.vue'),
    meta: { requiresAuth: true },
  },
  // 404: any route that does not exist
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]
