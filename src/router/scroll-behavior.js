// BGSI-263: every navigation starts at the top, so Inicio always opens on the hero
export function scrollBehavior() {
  return { top: 0 }
}
