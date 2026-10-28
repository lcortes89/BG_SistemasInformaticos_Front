import { describe, it, expect } from 'vitest'
import BaseRepository from '@/core/apis/base/BaseRepository'

describe('BaseRepository.messageFor', () => {
  it('uses a friendly message for 403', () => {
    expect(BaseRepository.messageFor(403, 'Access denied')).toBe('No tienes permiso para realizar esta acción.')
  })

  it('uses a friendly message for server errors', () => {
    expect(BaseRepository.messageFor(500, 'NullPointerException')).toBe('Ha ocurrido un error en el servidor. Inténtalo más tarde.')
  })

  it('uses a friendly message for 429 (BGSI-284)', () => {
    expect(BaseRepository.messageFor(429, 'Too many failed attempts')).toBe('Demasiados intentos. Espera unos minutos y vuelve a intentarlo.')
  })

  it('keeps the backend message for other errors', () => {
    expect(BaseRepository.messageFor(400, 'Some fields are not valid')).toBe('Some fields are not valid')
  })

  it('explains when the server cannot be reached', () => {
    expect(BaseRepository.messageFor(undefined, undefined)).toBe('No se pudo conectar con el servidor. Inténtalo más tarde.')
  })
})
