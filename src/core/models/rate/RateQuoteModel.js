const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

// Result of the calculator (RateQuoteDTO)
export default class RateQuoteModel {

  constructor(monthlyPrice, basePrice, factor, additions) {
    this.monthlyPrice = monthlyPrice
    this.basePrice = basePrice
    this.factor = factor
    this.additions = additions
  }

  static create(dto, mapper) {
    const { monthlyPrice, basePrice, factor, additions } = mapper.quote(dto)
    return new RateQuoteModel(monthlyPrice, basePrice, factor, additions)
  }

  // 123.2 -> "123,20 €"
  getFormattedPrice() {
    return euros.format(this.monthlyPrice)
  }
}
