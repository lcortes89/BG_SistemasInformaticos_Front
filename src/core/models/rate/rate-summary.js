import { RATE_STEPS } from '@/core/models/rate/rate-steps'

// Text sent to the business with everything the visitor answered (BGSI-217)
// Example:
//   Solicitud desde la calculadora de tarifas
//   Negocio: Restaurante
//   ...
//   Precio estimado: 123,20 €/mes
export function buildRateSummary(answers, quote, comment = '', steps = RATE_STEPS) {
  const lines = ['Solicitud desde la calculadora de tarifas']

  steps.forEach((step) => {
    const option = step.options.find((item) => item.code === answers[step.key])
    lines.push(`${step.title}: ${option ? option.label : '-'}`)
  })

  lines.push(`Precio estimado: ${quote.getFormattedPrice()}/mes`)

  if (comment.trim()) {
    lines.push('', `Comentario: ${comment.trim()}`)
  }
  return lines.join('\n')
}
