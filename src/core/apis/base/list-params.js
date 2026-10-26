// BGSI-302: the filters of the admin lists. Empty filters are not sent
// e.g. withoutEmpty({ q: 'bar', active: null, brandId: '' }) -> { q: 'bar' }
export function withoutEmpty(filters = {}) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== null && value !== undefined && value !== ''),
  )
}

// The query params of one page of an admin list: listParams(0, 6, { q: 'bar' }) -> { page: 0, size: 6, q: 'bar' }
export function listParams(page, size, filters = {}) {
  return { page, size, ...withoutEmpty(filters) }
}
