import RateOptionModel from '@/core/models/rate/RateOptionModel'

const toNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)
const textOrNull = (value) => (value ?? '').trim() || null

// Backend JSON (AdminRateOptionDTO) -> model fields
export const rateOptionMapper = {
  id: (dto) => dto.id,
  icon: (dto) => dto.icon ?? '',
  label: (dto) => dto.label,
  description: (dto) => dto.description ?? '',
  amount: (dto) => toNumber(dto.amount),
  adjustmentType: (dto) => dto.adjustmentType,
  position: (dto) => dto.position ?? 0,

  // Admin form -> RateOptionRequestDTO
  toRequest: (form) => ({
    icon: textOrNull(form.icon),
    label: form.label.trim(),
    description: textOrNull(form.description),
    amount: Number(form.amount),
    adjustmentType: form.adjustmentType,
  }),
}

// Backend JSON (AdminRateQuestionDTO) -> model fields (BGSI-234)
export const rateQuestionMapper = {
  id: (dto) => dto.id,
  title: (dto) => dto.title,
  question: (dto) => dto.question,
  hint: (dto) => dto.hint ?? '',
  position: (dto) => dto.position ?? 0,
  active: (dto) => dto.active ?? true,
  options: (dto) => (dto.options ?? []).map((option) => RateOptionModel.create(option, rateOptionMapper)),

  // Admin form -> RateQuestionRequestDTO
  toRequest: (form) => ({
    title: form.title.trim(),
    question: form.question.trim(),
    hint: textOrNull(form.hint),
    active: form.active,
  }),
}
