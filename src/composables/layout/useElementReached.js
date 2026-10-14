import { onMounted, onUnmounted, ref, watch } from 'vue'

// Pure logic (no window): has the visitor scrolled down to the element?
// Yes when its top edge is already inside the screen or above it (BGSI-236).
export function isElementReached(elementTop, viewportHeight) {
  return elementTop < viewportHeight
}

// Hook: keeps "isReached" up to date while the page scrolls, resizes
// or grows (e.g. when the brands arrive from the API and push the card down).
// "target" is a ref to a DOM element or to a component (we use its $el).
export function useElementReached(target) {
  const isReached = ref(false)
  let pageObserver = null

  function update() {
    const element = target.value?.$el ?? target.value
    isReached.value = element
      ? isElementReached(element.getBoundingClientRect().top, window.innerHeight)
      : false
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    if (typeof ResizeObserver !== 'undefined') {
      pageObserver = new ResizeObserver(update)
      pageObserver.observe(document.body)
    }
    update()
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    pageObserver?.disconnect()
  })

  // When the route changes the orange card is rendered again
  watch(target, update, { flush: 'post' })

  return { isReached }
}
