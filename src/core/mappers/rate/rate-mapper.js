// The backend sends BigDecimal values; Number() makes sure we work with numbers
const toNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

export const rateMapper = {
  // RateStepDTO -> one step of the wizard (BGSI-235).
  // key = question id and code = option id, so the answers are { questionId: optionId }
  step: (dto) => ({
    key: String(dto.id),
    title: dto.title,
    question: dto.question,
    hint: dto.hint ?? '',
    options: (dto.options ?? []).map((option) => ({
      code: option.id,
      icon: option.icon ?? '',
      label: option.label,
      description: option.description ?? '',
    })),
  }),

  // Wizard answers -> RateCalculationRequestDTO { optionIds: [...] }
  toRequest: (answers) => ({
    optionIds: Object.values(answers).filter((optionId) => optionId !== null && optionId !== undefined),
  }),

  // RateQuoteDTO -> plain values for RateQuoteModel
  quote: (dto) => ({
    monthlyPrice: toNumber(dto.monthlyPrice),
    basePrice: toNumber(dto.basePrice),
    factor: toNumber(dto.factor),
    additions: toNumber(dto.additions),
  }),
}
