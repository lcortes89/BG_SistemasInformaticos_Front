<script setup>
import { reactive, ref, watch } from 'vue'
import { ADJUSTMENT_TYPES } from '@/core/models/rate/RateOptionModel'

// One question of the wizard in the admin panel, with its options (BGSI-234)
const props = defineProps({
  question: { type: Object, required: true }, // RateQuestionModel
  index: { type: Number, required: true }, // 0-based position in the list
  total: { type: Number, required: true },
  initiallyOpen: { type: Boolean, default: false },
  savingOptionId: { type: [Number, null], default: null },
  rowErrors: { type: Object, default: () => ({}) }, // { [optionId]: message }
})

const emit = defineEmits([
  'move', 'toggle-active', 'edit', 'delete',
  'add-option', 'edit-option', 'delete-option', 'save-price',
])

const isOpen = ref(props.initiallyOpen)

// Local copy of "how it affects the price" and the amount, so they can change before saving.
// (v-model on a number input gives a Number, so we compare them as text)
const drafts = reactive({})
watch(() => props.question.options, (options) => {
  options.forEach((option) => {
    drafts[option.id] = { adjustmentType: option.adjustmentType, amount: String(option.amount) }
  })
}, { immediate: true, deep: true })

const isChanged = (option) => drafts[option.id]
  && (drafts[option.id].adjustmentType !== option.adjustmentType || String(drafts[option.id].amount) !== String(option.amount))
</script>

<template>
  <section class="question" :class="{ 'is-hidden': !question.active }">
    <div class="question__top">
      <div class="question__order">
        <button type="button" :disabled="index === 0" aria-label="Subir pregunta" @click="emit('move', -1)">▲</button>
        <button type="button" :disabled="index === total - 1" aria-label="Bajar pregunta" @click="emit('move', 1)">▼</button>
      </div>

      <span class="question__step" aria-hidden="true">{{ index + 1 }}</span>

      <button type="button" class="question__summary" :aria-expanded="isOpen" @click="isOpen = !isOpen">
        <small>Paso {{ index + 1 }} · {{ question.title }}</small>
        <span>{{ question.question }}</span>
      </button>

      <span class="question__count">{{ question.getOptionsLabel() }}</span>

      <label class="question__switch">
        <input type="checkbox" role="switch" :checked="question.active" @change="emit('toggle-active')" />
        <span>{{ question.active ? 'Visible' : 'Oculta' }}</span>
      </label>

      <button type="button" class="question__chevron" :aria-label="isOpen ? 'Cerrar' : 'Abrir'" @click="isOpen = !isOpen">
        {{ isOpen ? '▲' : '▼' }}
      </button>
    </div>

    <div v-if="isOpen" class="question__body">
      <div class="question__actions">
        <button type="button" class="question__link" @click="emit('edit')">✏️ Editar pregunta</button>
        <button type="button" class="question__link question__link--danger" @click="emit('delete')">🗑️ Borrar pregunta</button>
      </div>

      <p v-if="question.options.length === 0" class="question__empty">
        Esta pregunta todavía no tiene opciones, así que no aparece en la web.
      </p>

      <table v-else class="question__table">
        <thead>
          <tr>
            <th scope="col">Icono</th>
            <th scope="col">Opción que ve el cliente</th>
            <th scope="col">Cómo afecta al precio</th>
            <th scope="col">Importe</th>
            <th scope="col"><span class="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="option in question.options" :key="option.id">
            <td class="question__icon" aria-hidden="true">{{ option.icon }}</td>
            <td>
              <strong>{{ option.label }}</strong>
              <small v-if="option.description">{{ option.description }}</small>
            </td>
            <td>
              <select v-model="drafts[option.id].adjustmentType" :aria-label="`Cómo afecta al precio: ${option.label}`">
                <option v-for="type in ADJUSTMENT_TYPES" :key="type.value" :value="type.value">{{ type.label }}</option>
              </select>
            </td>
            <td>
              <div class="question__amount">
                <span aria-hidden="true">{{ drafts[option.id].adjustmentType === 'FACTOR' ? '×' : '€' }}</span>
                <input v-model="drafts[option.id].amount" type="number" min="0" step="0.01" inputmode="decimal"
                       :aria-label="`Importe: ${option.label}`" :aria-invalid="!!rowErrors[option.id]" />
                <button type="button" class="btn btn--primary question__save"
                        :disabled="savingOptionId === option.id || !isChanged(option)"
                        @click="emit('save-price', option, { ...drafts[option.id] })">
                  {{ savingOptionId === option.id ? 'Guardando…' : 'Guardar' }}
                </button>
              </div>
              <p v-if="rowErrors[option.id]" class="question__error" role="alert">{{ rowErrors[option.id] }}</p>
            </td>
            <td class="question__row-actions">
              <button type="button" :aria-label="`Editar ${option.label}`" @click="emit('edit-option', option)">✏️</button>
              <button type="button" :aria-label="`Borrar ${option.label}`" @click="emit('delete-option', option)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <button type="button" class="question__add" @click="emit('add-option')">+ Añadir opción</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.question {
  margin-bottom: 0.8rem;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(11, 31, 58, 0.07);

  &.is-hidden { opacity: 0.65; }

  &__top { display: flex; align-items: center; gap: 0.9rem; padding: 1rem 1.1rem; }

  &__order {
    display: flex;
    flex-direction: column;
    gap: 2px;

    button {
      width: 26px;
      height: 20px;
      padding: 0;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      background: #fff;
      color: var(--color-muted);
      font-size: 0.65rem;
      cursor: pointer;

      &:disabled { opacity: 0.35; cursor: not-allowed; }
    }
  }

  &__step {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--color-navy);
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
  }

  &__summary {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--color-navy);
    font: inherit;
    font-weight: 700;
    text-align: left;
    cursor: pointer;

    small {
      color: var(--color-orange);
      font-size: 0.7rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  }

  &__count { color: var(--color-muted); font-size: 0.85rem; white-space: nowrap; }

  &__switch {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--color-muted);
    font-size: 0.8rem;
    white-space: nowrap;
    cursor: pointer;

    input { width: 18px; height: 18px; accent-color: #22c55e; }
  }

  &__chevron { border: 0; background: none; color: var(--color-muted); cursor: pointer; }

  &__body { padding: 0.5rem 1.1rem 1rem; border-top: 1px solid #eef2f7; }

  &__actions { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem; }

  &__link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--color-navy);
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;

    &--danger { color: #b91c1c; }
  }

  &__empty { color: var(--color-muted); }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;

    th {
      padding: 0.6rem 0.5rem;
      border-bottom: 1px solid #eef2f7;
      color: var(--color-muted);
      font-size: 0.72rem;
      letter-spacing: 0.05em;
      text-align: left;
      text-transform: uppercase;
    }

    td { padding: 0.6rem 0.5rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    td small { display: block; color: var(--color-muted); font-size: 0.8rem; }

    select { padding: 0.35rem 0.5rem; border: 1px solid #d5dce6; border-radius: 6px; background: #fff; font: inherit; font-size: 0.85rem; }
  }

  &__icon { font-size: 1.3rem; }

  &__amount {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    span { color: var(--color-muted); font-weight: 600; }

    input {
      width: 6rem;
      padding: 0.35rem 0.5rem;
      border: 1px solid #d5dce6;
      border-radius: 6px;
      font: inherit;
      font-size: 0.85rem;
      text-align: right;

      &[aria-invalid='true'] { border-color: #b91c1c; }
    }
  }

  &__save {
    padding: 0.35rem 0.7rem;
    font: inherit;
    font-size: 0.8rem;
    font-weight: 600;

    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }

  &__error { margin: 0.25rem 0 0; color: #b91c1c; font-size: 0.8rem; }

  &__row-actions {
    white-space: nowrap;

    button { padding: 0.2rem 0.35rem; border: 0; background: none; font-size: 1rem; cursor: pointer; }
  }

  &__add {
    margin-top: 0.75rem;
    padding: 0;
    border: 0;
    background: none;
    color: var(--color-orange-dark);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }
}

// Mobile: each option becomes a small card
@media (max-width: 700px) {
  .question__count { display: none; }
  .question__top { gap: 0.6rem; }
  .question__table thead { display: none; }

  .question__table,
  .question__table tbody,
  .question__table tr,
  .question__table td { display: block; width: 100%; }

  .question__table tr { margin: 0.5rem 0; padding: 0.4rem; border: 1px solid #eef2f7; border-radius: 8px; }
  .question__table td { padding: 0.3rem 0.4rem; border: 0; }
}
</style>
