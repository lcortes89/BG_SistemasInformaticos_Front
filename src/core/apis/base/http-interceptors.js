// getToken: returns the current JWT (or null)
// onUnauthorized: what to do when the backend rejects our token (401)
export function setupInterceptors(http, { getToken, onUnauthorized }) {

  // Before each request: add "Authorization: Bearer <token>" if we have one.
  // Not on the login request: it already sends the email and password (config.auth)
  http.interceptors.request.use((config) => {
    const token = getToken()
    if (token && !config.auth) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // After each failed response: a 401 on a request that carried our token
  // means the session is no longer valid (expired or revoked)
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      const sentToken = !!error.config?.headers?.Authorization?.startsWith?.('Bearer ')
      if (error.response?.status === 401 && sentToken) onUnauthorized()
      return Promise.reject(error)
    },
  )
}
