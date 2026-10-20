import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import AuthService from '@/core/apis/auth/AuthService'
import SessionModel from '@/core/models/auth/SessionModel'

export const STORAGE_KEY = 'bgsi-session'

function readStoredSession() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return data ? new SessionModel(data.token, data.email, data.role) : null
  } catch {
    return null
  }
}

function storeSession(session) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage blocked (private mode): the session only lives until the page is reloaded
  }
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref(readStoredSession())

  const isAuthenticated = computed(() => !!session.value && !session.value.isExpired())
  const isAdmin = computed(() => isAuthenticated.value && session.value.isAdmin())
  const token = computed(() => session.value?.token ?? null)
  const email = computed(() => session.value?.email ?? null)

  async function login(userEmail, password, service = new AuthService()) {
    session.value = await service.login(userEmail, password)
    storeSession(session.value)
  }

  function logout() {
    session.value = null
    storeSession(null)
  }

  // BGSI-272: after changing the password the backend sends a new token (the old one stops working)
  function replaceToken(newToken) {
    if (!session.value) return
    session.value = new SessionModel(newToken, session.value.email, session.value.role)
    storeSession(session.value)
  }

  // Another tab logged in or out: read the session again from localStorage (BGSI-257)
  function syncFromStorage() {
    session.value = readStoredSession()
  }

  return { session, isAuthenticated, isAdmin, token, email, login, logout, replaceToken, syncFromStorage }
})
