<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import LoadingSpinner from '@/shared/LoadingSpinner.vue'
import ModalDialog from '@/shared/ModalDialog.vue'
import ConfirmDialog from '@/shared/ConfirmDialog.vue'
import RateQuestionCard from '@/components/admin/RateQuestionCard.vue'
import RateQuestionForm from '@/components/admin/RateQuestionForm.vue'
import RateOptionForm from '@/components/admin/RateOptionForm.vue'
import { useAdminRateQuestions } from '@/composables/admin/useAdminRateQuestions'

// BGSI-234: the admin manages the questions, options and prices of the rate wizard
const props = defineProps({
  // Optional: lets the tests pass a fake AdminRateQuestionService
  rateQuestionService: { type: Object, default: undefined },
})

const {
  questions, isLoading, isSaving, error, feedback, actionError, savingOptionId, rowErrors,
  load, saveQuestion, saveOption, toggleActive, move, removeQuestion, removeOption, saveOptionPrice,
} = useAdminRateQuestions(props.rateQuestionService)

// Modals: question form, option form and the two "are you sure?" dialogs
const questionForm = ref(null) // { question: RateQuestionModel | null }
const optionForm = ref(null) // { question, option: RateOptionModel | null }
const questionToDelete = ref(null)
const optionToDelete = ref(null)
const formError = ref(null)

function openQuestionForm(question = null) {
  formError.value = null
  questionForm.value = { question }
}

function openOptionForm(question, option = null) {
  formError.value = null
  optionForm.value = { question, option }
}

async function submitQuestion(form) {
  try {
    await saveQuestion(questionForm.value.question?.id ?? null, form)
    questionForm.value = null
  } catch (e) {
    formError.value = e.message
  }
}

async function submitOption(form) {
  try {
    await saveOption(optionForm.value.question.id, optionForm.value.option?.id ?? null, form)
    optionForm.value = null
  } catch (e) {
    formError.value = e.message
  }
}

async function confirmDeleteQuestion() {
  const question = questionToDelete.value
  questionToDelete.value = null
  await removeQuestion(question)
}

async function confirmDeleteOption() {
  const option = optionToDelete.value
  optionToDelete.value = null
  await removeOption(option)
}

onMounted(load)
</script>

<template>
  <section>
    <header class="admin-page__header">
      <div>
        <h1>Asistente de tarifas</h1>
        <p>Preguntas que ve el cliente en Tarifas y cuánto suma cada respuesta.</p>
      </div>
      <div class="admin-page__tools">
        <RouterLink :to="{ name: 'rates' }" target="_blank" class="admin-rates__preview">Ver como cliente ↗</RouterLink>
        <button type="button" class="btn btn--primary admin-page__new" @click="openQuestionForm()">+ Nueva pregunta</button>
      </div>
    </header>

    <p class="admin-rates__formula">
      Precio mensual =
      <span class="admin-rates__pill admin-rates__pill--base">Precio base</span> ×
      <span class="admin-rates__pill admin-rates__pill--factor">Multiplica</span> +
      <span class="admin-rates__pill admin-rates__pill--addition">Suma</span>
      <span class="admin-rates__example">
        · Ejemplo: Restaurante 49 € × 2 o 3 locales (×1,8) + terraza 10 € = <strong>98,20 €/mes</strong>
      </span>
    </p>

    <Transition name="slide-fade">
      <p v-if="feedback" class="admin-page__feedback" role="status">{{ feedback }}</p>
    </Transition>
    <Transition name="slide-fade">
      <p v-if="actionError" class="admin-page__error" role="alert">{{ actionError }}</p>
    </Transition>

    <LoadingSpinner v-if="isLoading && questions.length === 0" label="Cargando preguntas..." />
    <p v-else-if="error" class="admin-page__error" role="alert">{{ error }}</p>
    <p v-else-if="questions.length === 0" class="admin-rates__empty">
      Todavía no hay preguntas. Crea la primera con "+ Nueva pregunta".
    </p>
    <template v-else>
      <RateQuestionCard
        v-for="(question, index) in questions"
        :key="question.id"
        :question="question"
        :index="index"
        :total="questions.length"
        :initially-open="index === 0"
        :saving-option-id="savingOptionId"
        :row-errors="rowErrors"
        @move="move(question, $event)"
        @toggle-active="toggleActive(question)"
        @edit="openQuestionForm(question)"
        @delete="questionToDelete = question"
        @add-option="openOptionForm(question)"
        @edit-option="openOptionForm(question, $event)"
        @delete-option="optionToDelete = $event"
        @save-price="(option, draft) => saveOptionPrice(question, option, draft)"
      />
    </template>

    <Transition name="slide-fade">
      <ModalDialog v-if="questionForm" :title="questionForm.question ? 'Editar pregunta' : 'Nueva pregunta'"
                   @close="questionForm = null">
        <RateQuestionForm :question="questionForm.question" :is-saving="isSaving" :server-error="formError"
                          @submit="submitQuestion" @cancel="questionForm = null" />
      </ModalDialog>
    </Transition>

    <Transition name="slide-fade">
      <ModalDialog v-if="optionForm" :title="optionForm.option ? 'Editar opción' : `Nueva opción · ${optionForm.question.title}`"
                   @close="optionForm = null">
        <RateOptionForm :option="optionForm.option" :is-saving="isSaving" :server-error="formError"
                        @submit="submitOption" @cancel="optionForm = null" />
      </ModalDialog>
    </Transition>

    <Transition name="slide-fade">
      <ConfirmDialog
        v-if="questionToDelete"
        title="Borrar pregunta"
        :message="`¿Seguro que quieres borrar «${questionToDelete.question}» y sus ${questionToDelete.options.length} opciones? Si solo quieres quitarla un tiempo, ocúltala.`"
        confirm-label="Borrar"
        @confirm="confirmDeleteQuestion"
        @cancel="questionToDelete = null"
      />
    </Transition>

    <Transition name="slide-fade">
      <ConfirmDialog
        v-if="optionToDelete"
        title="Borrar opción"
        :message="`¿Seguro que quieres borrar la opción «${optionToDelete.label}»?`"
        confirm-label="Borrar"
        @confirm="confirmDeleteOption"
        @cancel="optionToDelete = null"
      />
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.admin-rates {
  &__preview {
    padding: 0.6rem 1rem;
    border: 1px solid #d5dce6;
    border-radius: var(--radius);
    background: #fff;
    color: var(--color-navy);
    font-weight: 600;
    text-decoration: none;
  }

  &__formula {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1.25rem;
    padding: 0.75rem 1rem;
    border: 1px solid #fed7aa;
    border-radius: 10px;
    background: #fff7ed;
    font-size: 0.9rem;
  }

  &__pill {
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;

    &--base { color: #1e40af; background: #dbeafe; }
    &--factor { color: #5b21b6; background: #ede9fe; }
    &--addition { color: #166534; background: #dcfce7; }
  }

  &__example { color: var(--color-muted); }
  &__example strong { color: #c2410c; }
  &__empty { color: var(--color-muted); }
}
</style>
