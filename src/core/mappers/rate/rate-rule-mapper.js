// Title of each block in the admin panel (one per question of the wizard)
const CATEGORY_TITLES = {
  BUSINESS_TYPE: 'Tipo de negocio',
  NUM_LOCATIONS: 'Número de locales',
  POS_COUNT: 'Puntos de venta',
  TERRACE: 'Espacio',
  SQUARE_METERS: 'Superficie',
}

// Backend JSON (AdminRateRuleDTO) -> model fields, with safe defaults
export const rateRuleMapper = {
  id: (dto) => dto.id,
  category: (dto) => dto.category,
  optionCode: (dto) => dto.optionCode,
  label: (dto) => dto.label ?? dto.optionCode,
  amount: (dto) => (Number.isFinite(Number(dto.amount)) ? Number(dto.amount) : 0),
  adjustmentType: (dto) => dto.adjustmentType,
  categoryTitle: (category) => CATEGORY_TITLES[category] ?? category,
}
