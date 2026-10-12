import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { adminGuard } from './guards'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Runs before every navigation (navigation guard)
router.beforeEach((to) => adminGuard(to, useAuthStore()))

export default router
