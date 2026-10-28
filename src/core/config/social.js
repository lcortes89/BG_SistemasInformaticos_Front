// BGSI-320: the social networks and WhatsApp of the company (one place for the whole website)
export const SOCIAL_LINKS = [
  { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/bgconsultoria/' },
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/guty.ribadeo' },
  { key: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/javi-guty-8112ab399/' },
]

export const WHATSAPP = {
  phone: '34615471066', // international format, without "+" or spaces (what wa.me needs)
  display: '+34 615 471 066',
  message: 'Hola, me gustaría información sobre los sistemas de BG Sistemas Informáticos.',
}

// "Click to chat": opens WhatsApp (app or web) with the message already written.
// The visitor starts the chat from their own WhatsApp: no API, no Meta script on our website
export function whatsappUrl(message = WHATSAPP.message) {
  return `https://wa.me/${WHATSAPP.phone}?text=${encodeURIComponent(message)}`
}
