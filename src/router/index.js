import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { adminGuard } from './guards'
import { scrollBehavior } from './scroll-behavior'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior,
})

// Runs before every navigation (navigation guard)
router.beforeEach((to) => adminGuard(to, useAuthStore()))

export default router
