// The backend sends BigDecimal values; Number() makes sure we work with numbers
const toNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

export const rateMapper = {
  // Wizard answers -> RateCalculationRequestDTO
  toRequest: (answers) => ({
    businessType: answers.businessType,
    locations: answers.locations,
    posCount: answers.posCount,
    space: answers.space,
    squareMeters: answers.squareMeters,
  }),

  // RateQuoteDTO -> plain values for RateQuoteModel
  quote: (dto) => ({
    monthlyPrice: toNumber(dto.monthlyPrice),
    basePrice: toNumber(dto.basePrice),
    factor: toNumber(dto.factor),
    additions: toNumber(dto.additions),
  }),
}
