// Same questions the backend creates on start-up (RateQuestionInitializer), already mapped
// to the shape the wizard uses: key = question id, option code = option id (BGSI-235)
export const RATE_STEPS = [
  {
    key: '1', title: 'Negocio', question: '¿Qué tipo de negocio tienes?',
    hint: 'Elige la opción que mejor describa tu actividad.',
    options: [
      { code: 1, icon: '🍽️', label: 'Restaurante', description: 'Comedor con servicio de mesa.' },
      { code: 2, icon: '☕', label: 'Bar o Cafetería', description: 'Barra, terraza y servicio rápido.' },
      { code: 3, icon: '🛵', label: 'Dark Kitchen', description: 'Solo cocina para delivery.' },
      { code: 4, icon: '🚚', label: 'Food truck / Pop-up', description: 'Negocio móvil o temporal.' },
      { code: 5, icon: '🏪', label: 'Otros', description: 'Comercio, panadería, heladería…' },
    ],
  },
  {
    key: '2', title: 'Locales', question: '¿Cuántos locales tienes?',
    hint: 'El precio se ajusta según el número de establecimientos.',
    options: [
      { code: 6, icon: '🏠', label: '1 local', description: 'Un único establecimiento.' },
      { code: 7, icon: '🏘️', label: '2 o 3 locales', description: 'Una pequeña cadena.' },
      { code: 8, icon: '🏙️', label: '4 o más', description: 'Grupo de restauración.' },
    ],
  },
  {
    key: '3', title: 'Puntos de venta', question: '¿Cuántos puntos de venta (TPV) necesitas por local?',
    hint: 'Cada caja o terminal donde se cobra cuenta como un punto de venta.',
    options: [
      { code: 9, icon: '🖥️', label: '1 TPV', description: 'Una sola caja.' },
      { code: 10, icon: '💻', label: '2 o 3 TPV', description: 'Barra y comedor, por ejemplo.' },
      { code: 11, icon: '🧾', label: '4 o más', description: 'Varias zonas de cobro.' },
    ],
  },
  {
    key: '4', title: 'Espacio', question: '¿Cómo es tu espacio?',
    hint: 'La terraza suele necesitar comanderas o terminales extra.',
    options: [
      { code: 12, icon: '🪑', label: 'Solo interior', description: 'Comedor o barra interior.' },
      { code: 13, icon: '⛱️', label: 'Interior + terraza', description: 'También sirves en terraza.' },
    ],
  },
  {
    key: '5', title: 'Superficie', question: '¿Cuál es la superficie aproximada?',
    hint: 'Nos ayuda a calcular la cobertura de red y los equipos.',
    options: [
      { code: 14, icon: '📐', label: 'Menos de 100 m²', description: 'Local pequeño.' },
      { code: 15, icon: '📏', label: 'Entre 100 y 250 m²', description: 'Local mediano.' },
      { code: 16, icon: '🏢', label: 'Más de 250 m²', description: 'Local grande.' },
    ],
  },
]
