import { ref } from 'vue'

// BGSI-294: forms in two steps. Step 1: the data. Step 2: the first field is hidden
// and the important value (email or password) is typed again to catch typing mistakes.
// validateFirst: checks step 1 and returns true/false. onBack: empties the repeated value.
export function useConfirmStep({ validateFirst = () => true, onBack = () => {} } = {}) {
  const step = ref(1)
  const pasteBlocked = ref(false)

  function next() {
    if (!validateFirst()) return false
    pasteBlocked.value = false
    step.value = 2
    return true
  }

  function back() {
    onBack()
    pasteBlocked.value = false
    step.value = 1
  }

  function reset() {
    pasteBlocked.value = false
    step.value = 1
  }

  // @paste / @drop of the repeated email: nothing is pasted and a notice is shown
  function blockPaste(event) {
    event?.preventDefault()
    pasteBlocked.value = true
  }

  return { step, pasteBlocked, next, back, reset, blockPaste }
}
