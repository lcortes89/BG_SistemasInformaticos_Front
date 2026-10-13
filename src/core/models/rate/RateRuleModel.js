const TYPE_LABELS = {
  BASE: 'Precio base',
  FACTOR: 'Multiplica',
  ADDITION: 'Suma',
}

// One editable price rule of the calculator (AdminRateRuleDTO)
export default class RateRuleModel {

  constructor(id, category, optionCode, label, amount, adjustmentType) {
    this.id = id
    this.category = category
    this.optionCode = optionCode
    this.label = label
    this.amount = amount
    this.adjustmentType = adjustmentType
  }

  static create(dto, mapper) {
    return new RateRuleModel(
      mapper.id(dto),
      mapper.category(dto),
      mapper.optionCode(dto),
      mapper.label(dto),
      mapper.amount(dto),
      mapper.adjustmentType(dto),
    )
  }

  isFactor() {
    return this.adjustmentType === 'FACTOR'
  }

  getTypeLabel() {
    return TYPE_LABELS[this.adjustmentType] ?? this.adjustmentType
  }

  // A factor is "× 1.80"; a base price or an addition is in euros
  getUnit() {
    return this.isFactor() ? '×' : '€'
  }

  // Same rules as the backend: not empty, not negative, 2 decimals max, factor > 0
  validate(value) {
    if (value === '' || value === null || value === undefined) return 'El importe es obligatorio'
    const number = Number(value)
    if (!Number.isFinite(number)) return 'Introduce un número válido'
    if (number < 0) return 'No puede ser negativo'
    if (!/^\d+(\.\d{1,2})?$/.test(String(value))) return 'Máximo 2 decimales'
    if (this.isFactor() && number === 0) return 'Un multiplicador debe ser mayor que 0'
    return null
  }
}
