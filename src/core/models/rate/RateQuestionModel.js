// One question of the wizard as the admin panel sees it (AdminRateQuestionDTO, BGSI-234)
export default class RateQuestionModel {

  constructor(id, title, question, hint, position, active, options = []) {
    this.id = id
    this.title = title
    this.question = question
    this.hint = hint
    this.position = position
    this.active = active
    this.options = options // RateOptionModel[]
  }

  static create(dto, mapper) {
    return new RateQuestionModel(
      mapper.id(dto),
      mapper.title(dto),
      mapper.question(dto),
      mapper.hint(dto),
      mapper.position(dto),
      mapper.active(dto),
      mapper.options(dto),
    )
  }

  // "1 opción" / "3 opciones"
  getOptionsLabel() {
    return this.options.length === 1 ? '1 opción' : `${this.options.length} opciones`
  }
}
