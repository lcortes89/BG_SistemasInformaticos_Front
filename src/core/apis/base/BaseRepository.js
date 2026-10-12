import axios from 'axios'

// Shared axios instance: every repository calls the backend URL from .env
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

const FORBIDDEN_MESSAGE = 'No tienes permiso para realizar esta acción.'
const SERVER_ERROR_MESSAGE = 'Ha ocurrido un error en el servidor. Inténtalo más tarde.'
const NETWORK_ERROR_MESSAGE = 'No se pudo conectar con el servidor. Inténtalo más tarde.'

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

  // PATCH: changes only some fields of a resource
  async patch(path = '', body = {}) {
    return this.#request(() => http.patch(`${this.resource}${path}`, body))
  }

  // Keeps the message sent by the backend (ApiErrorDTO), except for 403 and 5xx
  async #request(call) {
    try {
      const response = await call()
      return response.data
    } catch (error) {
      const status = error.response?.status
      const apiError = error.response?.data
      const wrapped = new Error(BaseRepository.messageFor(status, apiError?.message))
      wrapped.status = status
      wrapped.details = apiError?.details || null
      throw wrapped
    }
  }

  static messageFor(status, backendMessage) {
    if (status === 403) return FORBIDDEN_MESSAGE
    if (status >= 500) return SERVER_ERROR_MESSAGE
    return backendMessage || NETWORK_ERROR_MESSAGE
  }
}
