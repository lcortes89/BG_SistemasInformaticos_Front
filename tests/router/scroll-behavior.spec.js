import { describe, it, expect } from 'vitest'
import { scrollBehavior } from '@/router/scroll-behavior'
import { routes } from '@/router/routes'

describe('opening the website (BGSI-263)', () => {
  it('the address "/" is the home page', () => {
    expect(routes.find((route) => route.path === '/').name).toBe('home')
  })

  it('every navigation starts at the top, so Inicio shows the hero first', () => {
    expect(scrollBehavior({ path: '/' }, { path: '/soluciones' }, { top: 900 })).toEqual({ top: 0 })
  })
})
