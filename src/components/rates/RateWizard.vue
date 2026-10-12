<script setup>
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import RateStepper from '@/components/rates/RateStepper.vue'
import RateOptionCard from '@/components/rates/RateOptionCard.vue'
import RateResult from '@/components/rates/RateResult.vue'
import { useRateWizard } from '@/composables/rates/useRateWizard'

const props = defineProps({
  // Optional: lets the tests pass a fake RateService
  rateService: { type: Object, default: undefined },
})

const {
  steps, stepIndex, answers, quote, isLoading, error,
  currentStep, isFirstStep, isLastStep, canContinue,
  select, next, back, restart,
} = useRateWizard(props.rateService)
</script>

<template>
  <div class="wizard">
    <RateStepper :steps="steps" :current="quote ? steps.length : stepIndex" />

    <LoadingSpinner v-if="isLoading" label="Calculando tu tarifa..." />

    <Transition v-else name="slide-fade" mode="out-in">
      <RateResult v-if="quote" key="result" :quote="quote" @restart="restart" />

      <div v-else :key="currentStep.key" class="wizard__step">
        <p class="wizard__counter">Paso {{ stepIndex + 1 }} de {{ steps.length }}</p>
        <h2 :id="`question-${currentStep.key}`" class="wizard__question">{{ currentStep.question }}</h2>
        <p class="wizard__hint">{{ currentStep.hint }}</p>

        <div class="wizard__options" role="radiogroup" :aria-labelledby="`question-${currentStep.key}`">
          <RateOptionCard v-for="option in currentStep.options" :key="option.code" :option="option"
                          :selected="answers[currentStep.key] === option.code" @select="select" />
        </div>

        <Transition name="slide-fade">
          <p v-if="error" class="wizard__error" role="alert">{{ error }}</p>
        </Transition>

        <div class="wizard__nav">
          <button v-if="!isFirstStep" type="button" class="wizard__back" @click="back">Atrás</button>
          <button type="button" class="wizard__next" :disabled="!canContinue" @click="next">
            {{ isLastStep ? 'Calcular tarifa' : 'Siguiente' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.wizard {
  &__counter { margin: 0; color: var(--color-orange); font-weight: 600; font-size: 0.9rem; }
  &__question { margin: 0.25rem 0 0.5rem; color: var(--color-navy); font-size: 1.6rem; }
  &__hint { margin: 0 0 1.5rem; color: var(--color-muted); }

  &__options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 1rem;
  }

  &__error { margin: 1rem 0 0; color: #b91c1c; }

  &__nav {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }

  &__back, &__next {
    padding: 0.8rem 1.75rem;
    border-radius: var(--radius);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  &__back {
    margin-right: auto;
    border: 2px solid var(--color-navy);
    background: transparent;
    color: var(--color-navy);
  }

  &__next {
    border: none;
    background: var(--color-orange);
    color: #fff;
    &:hover:not(:disabled) { background: var(--color-orange-dark); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
}

@media (max-width: 560px) {
  .wizard__question { font-size: 1.3rem; }
  .wizard__options { grid-template-columns: 1fr; }
}
</style>
