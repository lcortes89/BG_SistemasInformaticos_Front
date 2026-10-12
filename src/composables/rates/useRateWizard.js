import { computed, reactive, ref } from 'vue'
import RateService from '@/core/apis/rate/RateService'
import { RATE_STEPS } from '@/core/models/rate/rate-steps'

const emptyAnswers = () => Object.fromEntries(RATE_STEPS.map((step) => [step.key, null]))

export function useRateWizard(service = new RateService(), steps = RATE_STEPS) {
  const stepIndex = ref(0)
  const answers = reactive(emptyAnswers())
  const quote = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const currentStep = computed(() => steps[stepIndex.value])
  const isFirstStep = computed(() => stepIndex.value === 0)
  const isLastStep = computed(() => stepIndex.value === steps.length - 1)
  // A required question: you cannot continue without an answer
  const canContinue = computed(() => answers[currentStep.value.key] !== null)

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
    Object.assign(answers, emptyAnswers())
    stepIndex.value = 0
    quote.value = null
    error.value = null
  }

  return {
    steps, stepIndex, answers, quote, isLoading, error,
    currentStep, isFirstStep, isLastStep, canContinue,
    select, next, back, restart,
  }
}
