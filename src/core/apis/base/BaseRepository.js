import axios from 'axios'

// Shared axios instance: every repository calls the backend URL from .env
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

export default class BaseRepository {

  constructor(resource) {
    this.resource = resource // e.g. '/brands'
  }

  async get(path = '', params = {}) {
    return this.#request(() => http.get(`${this.resource}${path}`, { params }))
  }

  // config: extra axios options, e.g. { auth: { username, password } } for HTTP Basic
  async post(path = '', body = {}, config = {}) {
    return this.#request(() => http.post(`${this.resource}${path}`, body, config))
  }

  // Keeps the message sent by the backend (ApiErrorDTO) instead of a generic one
  async #request(call) {
    try {
      const response = await call()
      return response.data
    } catch (error) {
      const apiError = error.response?.data
      const wrapped = new Error(apiError?.message || 'No se pudo conectar con el servidor. Inténtalo más tarde.')
      wrapped.status = error.response?.status
      wrapped.details = apiError?.details || null
      throw wrapped
    }
  }
}
