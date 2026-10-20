import axios from 'axios'

// Shared axios instance: every repository calls the backend URL from .env
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

const FORBIDDEN_MESSAGE = 'No tienes permiso para realizar esta acción.'
const SERVER_ERROR_MESSAGE = 'Ha ocurrido un error en el servidor. Inténtalo más tarde.'
const NETWORK_ERROR_MESSAGE = 'No se pudo conectar con el servidor. Inténtalo más tarde.'
// BGSI-284: the backend asks to wait (e.g. too many failed logins)
const TOO_MANY_REQUESTS_MESSAGE = 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.'
// A route the backend does not know (e.g. the backend was not restarted after an update)
const NOT_FOUND_MESSAGE = 'No se ha encontrado el recurso. Comprueba que el servidor está actualizado.'

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

  // PUT: replaces the whole resource
  async put(path = '', body = {}) {
    return this.#request(() => http.put(`${this.resource}${path}`, body))
  }

  // PATCH: changes only some fields of a resource
  async patch(path = '', body = {}) {
    return this.#request(() => http.patch(`${this.resource}${path}`, body))
  }

  async delete(path = '') {
    return this.#request(() => http.delete(`${this.resource}${path}`))
  }

  // GET that returns a file instead of JSON (BGSI-254): the answer is a Blob
  async getFile(path = '', params = {}) {
    return this.#request(async () => {
      try {
        return await http.get(`${this.resource}${path}`, { params, responseType: 'blob' })
      } catch (error) {
        // The error body also comes as a Blob: read it as JSON to keep the backend message
        if (error.response?.data instanceof Blob) error.response.data = await BaseRepository.readJson(error.response.data)
        throw error
      }
    })
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

  static async readJson(blob) {
    try {
      return JSON.parse(await blob.text())
    } catch {
      return null
    }
  }

  static messageFor(status, backendMessage) {
    if (status === 403) return FORBIDDEN_MESSAGE
    if (status === 429) return TOO_MANY_REQUESTS_MESSAGE
    if (status >= 500) return SERVER_ERROR_MESSAGE
    if (status === 404 && (!backendMessage || backendMessage === 'Not Found')) return NOT_FOUND_MESSAGE
    return backendMessage || NETWORK_ERROR_MESSAGE
  }
}
