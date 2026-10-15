import { onMounted, onUnmounted, ref, watch } from 'vue'

// Pure logic (no window): has the element already gone up, out of the screen? (BGSI-247)
// Yes when its bottom edge is above the top of the screen (+ an optional offset for the header)
export function isElementPassed(elementBottom, offset = 0) {
  return elementBottom < offset
}

// Hook: keeps "isPassed" up to date while the page scrolls or resizes.
// "target" is a ref to a DOM element or to a component (we use its $el).
export function useElementPassed(target, offset = 0) {
  const isPassed = ref(false)

  function update() {
    const element = target.value?.$el ?? target.value
    isPassed.value = element ? isElementPassed(element.getBoundingClientRect().bottom, offset) : false
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  })

  // The brand cards appear after loading: check again when the element changes
  watch(target, update, { flush: 'post' })

  return { isPassed }
}
