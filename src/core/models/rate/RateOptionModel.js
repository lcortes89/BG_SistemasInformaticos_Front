// The 3 ways an answer changes the price: price = BASE x FACTOR + ADDITION
export const ADJUSTMENT_TYPES = [
  { value: 'BASE', label: 'Precio base' },
  { value: 'FACTOR', label: 'Multiplica' },
  { value: 'ADDITION', label: 'Suma' },
]

// One answer of a question of the wizard, with its price (AdminRateOptionDTO, BGSI-234)
export default class RateOptionModel {

  constructor(id, icon, label, description, amount, adjustmentType, position = 0) {
    this.id = id
    this.icon = icon
    this.label = label
    this.description = description
    this.amount = amount
    this.adjustmentType = adjustmentType
    this.position = position
  }

  static create(dto, mapper) {
    return new RateOptionModel(
      mapper.id(dto),
      mapper.icon(dto),
      mapper.label(dto),
      mapper.description(dto),
      mapper.amount(dto),
      mapper.adjustmentType(dto),
      mapper.position(dto),
    )
  }

  isFactor() {
    return this.adjustmentType === 'FACTOR'
  }

  getTypeLabel() {
    return ADJUSTMENT_TYPES.find((type) => type.value === this.adjustmentType)?.label ?? this.adjustmentType
  }

  // A factor is "× 1.80"; a base price or an addition is in euros
  getUnit() {
    return this.isFactor() ? '×' : '€'
  }

  // Same rules as the backend: not empty, not negative, 2 decimals max, factor > 0
  static validateAmount(value, adjustmentType) {
    if (value === '' || value === null || value === undefined) return 'El importe es obligatorio'
    const number = Number(value)
    if (!Number.isFinite(number)) return 'Introduce un número válido'
    if (number < 0) return 'No puede ser negativo'
    if (!/^\d+(\.\d{1,2})?$/.test(String(value))) return 'Máximo 2 decimales'
    if (adjustmentType === 'FACTOR' && number === 0) return 'Un multiplicador debe ser mayor que 0'
    return null
  }

  validate(value) {
    return RateOptionModel.validateAmount(value, this.adjustmentType)
  }
}
