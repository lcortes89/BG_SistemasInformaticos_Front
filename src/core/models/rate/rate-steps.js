// The 5 questions of the wizard. "key" is the field sent to the backend and
// each option "code" must match an optionCode of the backend (RateRuleInitializer).
export const RATE_STEPS = [
  {
    key: 'businessType',
    title: 'Negocio',
    question: '¿Qué tipo de negocio tienes?',
    hint: 'Elige la opción que mejor describa tu actividad.',
    options: [
      { code: 'RESTAURANT', icon: '🍽️', label: 'Restaurante', description: 'Comedor con servicio de mesa.' },
      { code: 'BAR_CAFE', icon: '☕', label: 'Bar o Cafetería', description: 'Barra, terraza y servicio rápido.' },
      { code: 'DARK_KITCHEN', icon: '🛵', label: 'Dark Kitchen', description: 'Solo cocina para delivery.' },
      { code: 'FOOD_TRUCK', icon: '🚚', label: 'Food truck / Pop-up', description: 'Negocio móvil o temporal.' },
      { code: 'OTHER', icon: '🏪', label: 'Otros', description: 'Comercio, panadería, heladería…' },
    ],
  },
  {
    key: 'locations',
    title: 'Locales',
    question: '¿Cuántos locales tienes?',
    hint: 'El precio se ajusta según el número de establecimientos.',
    options: [
      { code: 'ONE', icon: '🏠', label: '1 local', description: 'Un único establecimiento.' },
      { code: 'TWO_THREE', icon: '🏘️', label: '2 o 3 locales', description: 'Una pequeña cadena.' },
      { code: 'FOUR_PLUS', icon: '🏙️', label: '4 o más', description: 'Grupo de restauración.' },
    ],
  },
  {
    key: 'posCount',
    title: 'Puntos de venta',
    question: '¿Cuántos puntos de venta (TPV) necesitas por local?',
    hint: 'Cada caja o terminal donde se cobra cuenta como un punto de venta.',
    options: [
      { code: 'ONE', icon: '🖥️', label: '1 TPV', description: 'Una sola caja.' },
      { code: 'TWO_THREE', icon: '💻', label: '2 o 3 TPV', description: 'Barra y comedor, por ejemplo.' },
      { code: 'FOUR_PLUS', icon: '🧾', label: '4 o más', description: 'Varias zonas de cobro.' },
    ],
  },
  {
    key: 'space',
    title: 'Espacio',
    question: '¿Cómo es tu espacio?',
    hint: 'La terraza suele necesitar comanderas o terminales extra.',
    options: [
      { code: 'INDOOR', icon: '🪑', label: 'Solo interior', description: 'Comedor o barra interior.' },
      { code: 'WITH_TERRACE', icon: '⛱️', label: 'Interior + terraza', description: 'También sirves en terraza.' },
    ],
  },
  {
    key: 'squareMeters',
    title: 'Superficie',
    question: '¿Cuál es la superficie aproximada?',
    hint: 'Nos ayuda a calcular la cobertura de red y los equipos.',
    options: [
      { code: 'SMALL', icon: '📐', label: 'Menos de 100 m²', description: 'Local pequeño.' },
      { code: 'MEDIUM', icon: '📏', label: 'Entre 100 y 250 m²', description: 'Local mediano.' },
      { code: 'LARGE', icon: '🏢', label: 'Más de 250 m²', description: 'Local grande.' },
    ],
  },
]
