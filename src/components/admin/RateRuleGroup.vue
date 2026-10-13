<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  group: { type: Object, required: true }, // { category, title, rules: RateRuleModel[] }
  savingId: { type: [Number, null], default: null },
  errors: { type: Object, default: () => ({}) }, // { [ruleId]: message }
})

const emit = defineEmits(['save'])

// Local copy of each amount, so the input can change before saving
const drafts = reactive({})
watch(() => props.group.rules, (rules) => {
  rules.forEach((rule) => { drafts[rule.id] = String(rule.amount) })
}, { immediate: true })

const isChanged = (rule) => String(drafts[rule.id]) !== String(rule.amount)
</script>

<template>
  <section class="rate-group">
    <h2 class="rate-group__title">{{ group.title }}</h2>

    <form v-for="rule in group.rules" :key="rule.id" class="rate-group__row" novalidate
          @submit.prevent="emit('save', rule, drafts[rule.id])">
      <label :for="`rule-${rule.id}`" class="rate-group__label">
        {{ rule.label }}
        <span class="rate-group__type" :class="`rate-group__type--${rule.adjustmentType.toLowerCase()}`">
          {{ rule.getTypeLabel() }}
        </span>
      </label>

      <div class="rate-group__field">
        <span class="rate-group__unit" aria-hidden="true">{{ rule.getUnit() }}</span>
        <input :id="`rule-${rule.id}`" v-model="drafts[rule.id]" type="number" min="0" step="0.01"
               inputmode="decimal" :aria-invalid="!!errors[rule.id]" :aria-describedby="`rule-${rule.id}-error`" />
        <button type="submit" class="btn btn--primary rate-group__save"
                :disabled="savingId === rule.id || !isChanged(rule)">
          {{ savingId === rule.id ? 'Guardando…' : 'Guardar' }}
        </button>
      </div>

      <Transition name="slide-fade">
        <p v-if="errors[rule.id]" :id="`rule-${rule.id}-error`" class="rate-group__error" role="alert">
          {{ errors[rule.id] }}
        </p>
      </Transition>
    </form>
  </section>
</template>

<style scoped lang="scss">
.rate-group {
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  &__title { margin: 0 0 1rem; font-size: 1.1rem; color: var(--color-navy); }

  &__row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 0.25rem 1rem;
    padding: 0.75rem 0;
    border-top: 1px solid #eef0f3;
  }

  &__label { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; color: var(--color-text); }

  &__type {
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;

    &--base { color: #7c2d12; background: #ffedd5; }
    &--factor { color: #1e3a8a; background: #dbeafe; }
    &--addition { color: #14532d; background: #dcfce7; }
  }

  &__field { display: flex; align-items: center; gap: 0.5rem; }
  &__unit { min-width: 1rem; color: var(--color-muted); font-weight: 600; text-align: right; }

  input {
    width: 7rem;
    padding: 0.5rem 0.6rem;
    border: 1px solid #d1d5db;
    border-radius: var(--radius);
    font: inherit;
    text-align: right;

    &[aria-invalid='true'] { border-color: #b91c1c; }
  }

  &__save {
    padding: 0.5rem 0.9rem;
    font: inherit;
    font-weight: 600;

    &:disabled { opacity: 0.45; cursor: not-allowed; }
  }

  &__error { grid-column: 1 / -1; margin: 0; color: #b91c1c; font-size: 0.85rem; text-align: right; }
}

@media (max-width: 560px) {
  .rate-group__row { grid-template-columns: 1fr; }
  .rate-group__field { justify-content: flex-end; }
}
</style>
