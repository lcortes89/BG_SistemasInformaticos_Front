import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { http } from './core/apis/base/BaseRepository'
import { setupInterceptors } from './core/apis/base/http-interceptors'
import { useAuthStore } from './stores/auth'
import './assets/styles/style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
setupInterceptors(http, {
  getToken: () => authStore.token,
  onUnauthorized: () => {
    authStore.logout()
    router.push({ name: 'admin-login', query: { expired: '1' } })
  },
})

app.mount('#app')
