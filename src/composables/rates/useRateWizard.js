import { computed, reactive, ref } from 'vue'
import RateService from '@/core/apis/rate/RateService'

// BGSI-235: the questions come from the API (the admin manages them in the dashboard).
// "initialSteps" lets the tests skip the API.
export function useRateWizard(service = new RateService(), initialSteps = null) {
  const steps = ref(initialSteps ?? [])
  const isLoadingSteps = ref(false)
  const stepsError = ref(null)

  const stepIndex = ref(0)
  const answers = reactive({})
  const quote = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const currentStep = computed(() => steps.value[stepIndex.value] ?? null)
  const isFirstStep = computed(() => stepIndex.value === 0)
  const isLastStep = computed(() => stepIndex.value === steps.value.length - 1)
  // A required question: you cannot continue without an answer
  const canContinue = computed(() => !!currentStep.value && answers[currentStep.value.key] != null)

  function clearAnswers() {
    Object.keys(answers).forEach((key) => delete answers[key])
    steps.value.forEach((step) => { answers[step.key] = null })
  }
  clearAnswers()

  async function loadSteps() {
    if (initialSteps) return
    isLoadingSteps.value = true
    stepsError.value = null
    try {
      steps.value = await service.getSteps()
      clearAnswers()
    } catch (e) {
      stepsError.value = e.message
    } finally {
      isLoadingSteps.value = false
    }
  }

  function select(code) {
    answers[currentStep.value.key] = code
  }

  async function next() {
    if (!canContinue.value) return
    if (isLastStep.value) {
      await calculate()
    } else {
      stepIndex.value++
    }
  }

  // Going back keeps the answers already given
  function back() {
    if (quote.value) {
      quote.value = null
    } else if (!isFirstStep.value) {
      stepIndex.value--
    }
  }

  async function calculate() {
    isLoading.value = true
    error.value = null
    try {
      quote.value = await service.calculate(answers)
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  function restart() {
    clearAnswers()
    stepIndex.value = 0
    quote.value = null
    error.value = null
  }

  return {
    steps, isLoadingSteps, stepsError, loadSteps,
    stepIndex, answers, quote, isLoading, error,
    currentStep, isFirstStep, isLastStep, canContinue,
    select, next, back, restart,
  }
}
