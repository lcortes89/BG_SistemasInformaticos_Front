import { COMPANY } from '@/core/config/company'

// BGSI-321: the text of the three legal pages, by route name. Each paragraph is a list of parts:
// a text, { strong } (bold), { to } (link inside the website) or { href } (link to another website)
const CONTACT = { to: '/contacto', text: 'formulario de Contacto' }
const PRIVACY = { to: '/privacidad', text: 'Política de privacidad' }
const AEPD = { href: 'https://www.aepd.es', text: 'www.aepd.es' }

export const LEGAL_UPDATED = '24 de octubre de 2026'

export const LEGAL_PAGES = {
  'legal-notice': {
    title: 'Aviso legal',
    intro: [['Este aviso regula el uso del sitio web ', { strong: COMPANY.website }, '. Navegar por él supone aceptar estas condiciones.']],
    sections: [
      {
        id: 'titular',
        title: 'Titular del sitio web',
        list: [
          [{ strong: 'Titular: ' }, COMPANY.name],
          [{ strong: 'Domicilio: ' }, COMPANY.address],
          [{ strong: 'Sitio web: ' }, COMPANY.website],
          [{ strong: 'Contacto: ' }, 'a través del ', CONTACT, ' de esta web'],
          [{ strong: 'Actividad: ' }, 'venta, instalación y soporte de sistemas TPV, software de gestión y equipos informáticos para comercios y hostelería'],
        ],
      },
      {
        id: 'objeto',
        title: 'Objeto de la web',
        paragraphs: [
          ['La web informa sobre los productos y servicios de ', COMPANY.name, ' y permite enviar consultas. ',
            { strong: 'No se venden ni se contratan servicios online' }, ': las tarifas que se muestran son orientativas y cualquier contratación se acuerda aparte.'],
        ],
      },
      {
        id: 'uso',
        title: 'Condiciones de uso',
        paragraphs: [
          ['Te comprometes a usar la web de forma lícita, sin dañar su funcionamiento ni el de otros usuarios, y a que los datos que envíes por el formulario sean ciertos.'],
          ['El panel de administración es de uso exclusivo de las personas autorizadas por ', COMPANY.name, '.'],
        ],
      },
      {
        id: 'propiedad',
        title: 'Propiedad intelectual e industrial',
        paragraphs: [
          ['Los textos, el diseño y el código de la web pertenecen a ', COMPANY.name, ' o se usan con autorización. No se pueden copiar ni distribuir sin permiso.'],
          ['Las marcas, logotipos e imágenes de los fabricantes pertenecen a sus titulares y se muestran solo para informar de los productos que se comercializan.'],
        ],
      },
      {
        id: 'enlaces',
        title: 'Enlaces a otras webs',
        paragraphs: [
          ['La web tiene enlaces a redes sociales, a WhatsApp y a las fichas oficiales de los fabricantes. ',
            COMPANY.name, ' no es responsable del contenido ni de las políticas de esas webs.'],
        ],
      },
      {
        id: 'responsabilidad',
        title: 'Responsabilidad',
        paragraphs: [
          ['La información de la web se revisa con cuidado, pero puede cambiar o contener errores. ',
            COMPANY.name, ' no responde de las decisiones tomadas solo a partir de ella ni de cortes del servicio ajenos a su voluntad.'],
        ],
      },
      {
        id: 'ley',
        title: 'Legislación aplicable',
        paragraphs: [['Este aviso se rige por la legislación española.']],
      },
    ],
  },

  privacy: {
    title: 'Política de privacidad',
    intro: [['Aquí te explicamos qué datos recogemos cuando nos escribes, para qué y qué derechos tienes, según el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).']],
    sections: [
      {
        id: 'responsable',
        title: 'Responsable del tratamiento',
        list: [
          [{ strong: 'Responsable: ' }, COMPANY.name],
          [{ strong: 'Domicilio: ' }, COMPANY.address],
          [{ strong: 'Contacto: ' }, 'a través del ', CONTACT],
        ],
      },
      {
        id: 'datos',
        title: 'Qué datos recogemos',
        paragraphs: [
          ['Solo los que escribes en el formulario de contacto: ', { strong: 'nombre, email, teléfono (opcional), el producto que te interesa y tu mensaje' }, '.'],
        ],
      },
      {
        id: 'finalidad',
        title: 'Para qué los usamos',
        paragraphs: [
          ['Para ', { strong: 'responder a tu consulta' }, ' y, si nos lo pides, enviarte información o un presupuesto. ',
            'No enviamos publicidad, no hacemos perfiles y no tomamos decisiones automáticas con tus datos.'],
        ],
      },
      {
        id: 'legitimacion',
        title: 'Base legal',
        paragraphs: [
          ['Tu ', { strong: 'consentimiento' }, ', que das al marcar la casilla del formulario (art. 6.1.a del RGPD). Puedes retirarlo cuando quieras.'],
        ],
      },
      {
        id: 'conservacion',
        title: 'Cuánto tiempo los guardamos',
        paragraphs: [
          ['Hasta ', { strong: 'atender tu consulta' }, '. Después se borran, salvo que una ley obligue a guardarlos más tiempo.'],
        ],
      },
      {
        id: 'destinatarios',
        title: 'Quién más los ve',
        paragraphs: [
          ['No los cedemos a nadie, salvo obligación legal.'],
          ['Para que la web funcione usamos dos proveedores que los tratan solo por cuenta nuestra (encargados del tratamiento): ',
            'el proveedor de alojamiento de la web y ', { strong: 'Google (Gmail)' }, ', con el que se envían los avisos de cada mensaje nuevo. ',
            'Google puede tratar datos fuera del Espacio Económico Europeo con las garantías que exige el RGPD.'],
        ],
      },
      {
        id: 'whatsapp',
        title: 'Si nos escribes por WhatsApp',
        paragraphs: [
          ['El botón «Escríbenos por WhatsApp» abre tu propia app. Esa conversación la trata ', { strong: 'WhatsApp (Meta)' },
            ' según su política de privacidad; nosotros solo la usamos para contestarte.'],
        ],
      },
      {
        id: 'derechos',
        title: 'Tus derechos',
        paragraphs: [
          ['Puedes pedir ', { strong: 'acceder, rectificar o suprimir' }, ' tus datos, ', { strong: 'oponerte' }, ' a su uso, ',
            { strong: 'limitarlo' }, ' o pedir su ', { strong: 'portabilidad' }, '.'],
          ['Para hacerlo, escríbenos desde el ', CONTACT, ' indicando qué derecho quieres ejercer. Te contestaremos en un plazo máximo de un mes.'],
          ['Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos: ', AEPD, '.'],
        ],
      },
      {
        id: 'seguridad',
        title: 'Seguridad',
        paragraphs: [
          ['La web usa conexión cifrada y el acceso a los mensajes está limitado a los administradores, con contraseña y verificación en dos pasos opcional.'],
        ],
      },
    ],
  },

  cookies: {
    title: 'Política de cookies',
    intro: [['Las cookies son pequeños archivos que algunas webs guardan en tu navegador. Esta página explica cuáles usa esta web.']],
    sections: [
      {
        id: 'cuales',
        title: 'Qué cookies usa esta web',
        paragraphs: [
          [{ strong: 'Ninguna de análisis, de publicidad ni de terceros.' }],
          ['El panel de administración guarda en el navegador de las personas administradoras un dato técnico para mantener su sesión iniciada. ',
            'Es necesario para que el panel funcione y por eso no necesita consentimiento (art. 22.2 de la LSSI). Los visitantes de la web no tienen este dato.'],
        ],
      },
      {
        id: 'mapa',
        title: 'El mapa y los enlaces externos',
        paragraphs: [
          ['El mapa de la página de Contacto es de ', { strong: 'OpenStreetMap' }, ' y no instala cookies de terceros.'],
          ['Si pulsas un enlace a redes sociales, a WhatsApp o a la web de un fabricante, sales de esta web y se aplican las cookies y políticas de esa otra web.'],
        ],
      },
      {
        id: 'banner',
        title: 'Por qué no hay aviso de cookies',
        paragraphs: [
          ['Como solo se usa almacenamiento técnico, la ley no exige pedir consentimiento ni mostrar un aviso. ',
            'Si en el futuro se añadieran herramientas de análisis o de publicidad, se pediría tu consentimiento antes de activarlas.'],
        ],
      },
      {
        id: 'borrar',
        title: 'Cómo borrarlas',
        paragraphs: [
          ['Puedes ver y borrar los datos que guardan las webs desde los ajustes de privacidad de tu navegador. Más información en la ', PRIVACY, '.'],
        ],
      },
    ],
  },
}
