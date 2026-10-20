import { reactive, ref } from 'vue'
import AdminRateQuestionService from '@/core/apis/rate/AdminRateQuestionService'
import RateOptionModel from '@/core/models/rate/RateOptionModel'

// BGSI-234: the admin manages the questions and options of the rate wizard
export function useAdminRateQuestions(service = new AdminRateQuestionService()) {
  const questions = ref([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref(null)
  const feedback = ref(null)
  const actionError = ref(null)
  const savingOptionId = ref(null)
  const rowErrors = reactive({}) // { [optionId]: message }

  function clearMessages() {
    feedback.value = null
    actionError.value = null
  }

  async function load() {
    isLoading.value = true
    error.value = null
    try {
      questions.value = await service.getAll()
    } catch (e) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  // Shared by every change: runs it, shows the message and reloads the list
  async function run(action, successMessage) {
    clearMessages()
    try {
      await action()
      feedback.value = successMessage
      await load()
      return true
    } catch (e) {
      if (!e.cancelled) actionError.value = e.message // BGSI-275: password dialog closed
      return false
    }
  }

  // Forms: throw, so the modal can show the error next to the fields
  async function saveQuestion(id, form) {
    clearMessages()
    isSaving.value = true
    try {
      await service.saveQuestion(id, form)
      feedback.value = id ? 'Pregunta guardada' : 'Pregunta creada al final del asistente'
      await load()
    } finally {
      isSaving.value = false
    }
  }

  async function saveOption(questionId, optionId, form) {
    clearMessages()
    isSaving.value = true
    try {
      await service.saveOption(questionId, optionId, form)
      feedback.value = optionId ? `${form.label}: opción guardada` : `${form.label}: opción añadida`
      await load()
    } finally {
      isSaving.value = false
    }
  }

  function toggleActive(question) {
    const form = { title: question.title, question: question.question, hint: question.hint, active: !question.active }
    return run(() => service.saveQuestion(question.id, form),
      question.active ? `"${question.title}" oculta en la web` : `"${question.title}" visible en la web`)
  }

  // direction: -1 = up, +1 = down
  function move(question, direction) {
    const ids = questions.value.map((item) => item.id)
    const from = ids.indexOf(question.id)
    const to = from + direction
    if (to < 0 || to >= ids.length) return Promise.resolve(false)
    ;[ids[from], ids[to]] = [ids[to], ids[from]]
    return run(() => service.reorder(ids), 'Orden guardado')
  }

  function removeQuestion(question) {
    return run(() => service.removeQuestion(question.id), `Pregunta "${question.title}" borrada`)
  }

  function removeOption(option) {
    return run(() => service.removeOption(option.id), `Opción "${option.label}" borrada`)
  }

  // Inline change of "how it affects the price" and the amount of one option
  async function saveOptionPrice(question, option, draft) {
    clearMessages()
    delete rowErrors[option.id]
    const validationError = RateOptionModel.validateAmount(draft.amount, draft.adjustmentType)
    if (validationError) {
      rowErrors[option.id] = validationError
      return false
    }

    savingOptionId.value = option.id
    try {
      const saved = await service.saveOption(question.id, option.id, { ...option, ...draft })
      option.amount = saved.amount
      option.adjustmentType = saved.adjustmentType
      feedback.value = `${option.label}: precio guardado`
      return true
    } catch (e) {
      rowErrors[option.id] = e.message
      return false
    } finally {
      savingOptionId.value = null
    }
  }

  return {
    questions, isLoading, isSaving, error, feedback, actionError, savingOptionId, rowErrors,
    load, saveQuestion, saveOption, toggleActive, move, removeQuestion, removeOption, saveOptionPrice,
  }
}
