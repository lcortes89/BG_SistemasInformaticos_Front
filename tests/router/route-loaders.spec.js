import { describe, it, expect } from 'vitest'
import { routes } from '@/router/routes'

// BGSI-266: every page is loaded on demand (lazy loading); each loader must find its file
const allRoutes = routes.flatMap((route) => [route, ...(route.children ?? [])])

describe('route loaders', () => {
  it.each(allRoutes.filter((route) => route.component).map((route) => [route.name ?? route.path, route]))(
    '%s loads a Vue component',
    async (_name, route) => {
      const module = await route.component()
      expect(module.default).toBeTruthy()
    },
  )
})
