import { CONFIRM_HEADER } from '@/stores/confirmation'

// getToken: returns the current JWT (or null)
// onUnauthorized: what to do when the backend rejects our token (401)
// getConfirmToken (BGSI-275): returns the password confirmation token if it is still valid (or null)
// requestConfirmation (BGSI-275): opens "Confirma tu contraseña"; resolves with a new token, rejects if cancelled
export function setupInterceptors(http, { getToken, onUnauthorized, getConfirmToken = () => null, requestConfirmation = null }) {

  // Before each request: add "Authorization: Bearer <token>" if we have one.
  // Not on the login request: it already sends the email and password (config.auth)
  http.interceptors.request.use((config) => {
    const token = getToken()
    if (token && !config.auth) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    const confirmToken = token && !config.auth ? getConfirmToken() : null
    if (confirmToken && !config.headers?.[CONFIRM_HEADER]) {
      config.headers = config.headers || {}
      config.headers[CONFIRM_HEADER] = confirmToken
    }
    return config
  })

  // After each failed response: a 401 on a request that carried our token
  // means the session is no longer valid (expired or revoked)
  http.interceptors.response.use(
    (response) => response,
    async (error) => {
      const sentToken = !!error.config?.headers?.Authorization?.startsWith?.('Bearer ')
      if (error.response?.status === 401 && sentToken) onUnauthorized()

      // BGSI-275: sensitive action without a valid confirmation -> ask for the password and repeat it once
      const needsConfirmation = error.response?.status === 403
        && error.response?.data?.details?.reason === 'CONFIRMATION_REQUIRED'
      if (needsConfirmation && requestConfirmation && error.config && !error.config.confirmRetried) {
        const confirmToken = await requestConfirmation() // rejects with { cancelled: true } if cancelled
        error.config.confirmRetried = true
        error.config.headers = error.config.headers || {}
        error.config.headers[CONFIRM_HEADER] = confirmToken
        return http(error.config)
      }
      return Promise.reject(error)
    },
  )
}
