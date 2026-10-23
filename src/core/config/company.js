import { OFFICE } from '@/core/config/office'

// BGSI-321: who is behind the website (Aviso legal, Política de privacidad, contact form).
// The owner only wants the trade name to appear: no tax number or legal email
export const COMPANY = {
  name: 'BG Sistemas Informáticos',
  address: `${OFFICE.address}, España`,
  website: 'consultoriass.es',
}
