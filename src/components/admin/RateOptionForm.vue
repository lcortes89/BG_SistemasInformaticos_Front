<script setup>
import { reactive } from 'vue'
import RateOptionModel, { ADJUSTMENT_TYPES } from '@/core/models/rate/RateOptionModel'

// Create or edit one answer of a question (BGSI-234). Same limits as RateOptionRequestDTO
const props = defineProps({
  option: { type: Object, default: null }, // RateOptionModel when editing, null when creating
  isSaving: { type: Boolean, default: false },
  serverError: { type: String, default: null },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  icon: props.option?.icon ?? '',
  label: props.option?.label ?? '',
  description: props.option?.description ?? '',
  adjustmentType: props.option?.adjustmentType ?? 'ADDITION',
  amount: props.option ? String(props.option.amount) : '',
})
const errors = reactive({})

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (form.icon.length > 16) errors.icon = 'Máximo 16 caracteres'
  if (!form.label.trim()) errors.label = 'El texto de la opción es obligatorio'
  else if (form.label.length > 100) errors.label = 'Máximo 100 caracteres'
  if (form.description.length > 255) errors.description = 'Máximo 255 caracteres'
  const amountError = RateOptionModel.validateAmount(form.amount, form.adjustmentType)
  if (amountError) errors.amount = amountError
  return Object.keys(errors).length === 0
}

function submit() {
  if (validate()) emit('submit', { ...form })
}
</script>

<template>
  <form class="admin-form" novalidate @submit.prevent="submit">
    <div class="option-form__row">
      <div class="admin-form__field option-form__icon">
        <label for="option-icon">Icono</label>
        <input id="option-icon" v-model="form.icon" type="text" placeholder="🍽️" :aria-invalid="!!errors.icon" />
        <p v-if="errors.icon" class="admin-form__error">{{ errors.icon }}</p>
      </div>

      <div class="admin-form__field">
        <label for="option-label">Opción que ve el cliente *</label>
        <input id="option-label" v-model="form.label" type="text" placeholder="Restaurante" :aria-invalid="!!errors.label" />
        <p v-if="errors.label" class="admin-form__error">{{ errors.label }}</p>
      </div>
    </div>

    <div class="admin-form__field">
      <label for="option-description">Descripción (opcional)</label>
      <input id="option-description" v-model="form.description" type="text" :aria-invalid="!!errors.description" />
      <p v-if="errors.description" class="admin-form__error">{{ errors.description }}</p>
    </div>

    <div class="option-form__row">
      <div class="admin-form__field">
        <label for="option-type">Cómo afecta al precio *</label>
        <select id="option-type" v-model="form.adjustmentType">
          <option v-for="type in ADJUSTMENT_TYPES" :key="type.value" :value="type.value">{{ type.label }}</option>
        </select>
      </div>

      <div class="admin-form__field">
        <label for="option-amount">{{ form.adjustmentType === 'FACTOR' ? 'Multiplicador (×)' : 'Importe (€)' }} *</label>
        <input id="option-amount" v-model="form.amount" type="number" min="0" step="0.01" inputmode="decimal"
               :aria-invalid="!!errors.amount" />
        <p v-if="errors.amount" class="admin-form__error">{{ errors.amount }}</p>
      </div>
    </div>

    <p v-if="serverError" class="admin-form__alert" role="alert">{{ serverError }}</p>

    <div class="admin-form__actions">
      <button type="button" class="admin-form__cancel" @click="emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isSaving">
        {{ isSaving ? 'Guardando...' : 'Guardar opción' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.option-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.option-form__row:first-child { grid-template-columns: 6rem 1fr; }

@media (max-width: 560px) {
  .option-form__row,
  .option-form__row:first-child { grid-template-columns: 1fr; }
}
</style>
