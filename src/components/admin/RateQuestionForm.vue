<script setup>
import { reactive } from 'vue'

// Create or edit one question of the rate wizard (BGSI-234). Same limits as RateQuestionRequestDTO
const props = defineProps({
  question: { type: Object, default: null }, // RateQuestionModel when editing, null when creating
  isSaving: { type: Boolean, default: false },
  serverError: { type: String, default: null },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  title: props.question?.title ?? '',
  question: props.question?.question ?? '',
  hint: props.question?.hint ?? '',
  active: props.question?.active ?? true,
})
const errors = reactive({})

function validate() {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!form.title.trim()) errors.title = 'El nombre del paso es obligatorio'
  else if (form.title.length > 40) errors.title = 'Máximo 40 caracteres'
  if (!form.question.trim()) errors.question = 'La pregunta es obligatoria'
  else if (form.question.length > 150) errors.question = 'Máximo 150 caracteres'
  if (form.hint.length > 255) errors.hint = 'Máximo 255 caracteres'
  return Object.keys(errors).length === 0
}

function submit() {
  if (validate()) emit('submit', { ...form })
}
</script>

<template>
  <form class="admin-form" novalidate @submit.prevent="submit">
    <div class="admin-form__field">
      <label for="question-title">Nombre del paso *</label>
      <input id="question-title" v-model="form.title" type="text" placeholder="Negocio" :aria-invalid="!!errors.title" />
      <p v-if="errors.title" class="admin-form__error">{{ errors.title }}</p>
    </div>

    <div class="admin-form__field">
      <label for="question-text">Pregunta que ve el cliente *</label>
      <input id="question-text" v-model="form.question" type="text" placeholder="¿Qué tipo de negocio tienes?"
             :aria-invalid="!!errors.question" />
      <p v-if="errors.question" class="admin-form__error">{{ errors.question }}</p>
    </div>

    <div class="admin-form__field">
      <label for="question-hint">Ayuda (opcional)</label>
      <textarea id="question-hint" v-model="form.hint" rows="2" :aria-invalid="!!errors.hint"></textarea>
      <p v-if="errors.hint" class="admin-form__error">{{ errors.hint }}</p>
    </div>

    <label class="admin-form__check">
      <input id="question-active" v-model="form.active" type="checkbox" />
      Visible en la calculadora de la web
    </label>

    <p v-if="serverError" class="admin-form__alert" role="alert">{{ serverError }}</p>

    <div class="admin-form__actions">
      <button type="button" class="admin-form__cancel" @click="emit('cancel')">Cancelar</button>
      <button type="submit" class="btn btn--primary admin-form__submit" :disabled="isSaving">
        {{ isSaving ? 'Guardando...' : 'Guardar pregunta' }}
      </button>
    </div>
  </form>
</template>
