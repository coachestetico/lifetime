/* Todo lo que se cambia está acá: textos de arriba, video, precios, links, cupos y catálogo.
   Lo marcado con PENDIENTE es provisorio hasta tener el precio definitivo. */
const CONFIG = {
  titulo: "Tienes el equipo. <em>¿Sabes sacarle todo el provecho?</em>",
  bajada: "Mira este video antes de comprar tu próxima formación: te muestro cómo dejar de pagar un curso por cada equipo nuevo.",
  portada: "assets/img/lifetime-portada.webp",

  /* Video de venta en YouTube (oculto). PENDIENTE: ahora está la clase "Conoce todo sobre Lifetime" de prueba. */
  video: {
    youtube: "tGzlmKQ0LQo",
    ofertaSegundo: 0          // 0 = la oferta aparece al terminar el video; si no, en este segundo
  },

  /* Cupos a este precio: arrancan cada lunes en "total" y bajan durante la semana hasta "minimo". */
  cupos: { total: 30, minimo: 4 },

  whatsapp: {
    general: "https://wa.link/ol9o00",   // PENDIENTE: son los de Life+; cambiarlos por los de Lifetime
    AR: "https://wa.link/mdy1qb",
    VE: "https://wa.link/rbbk5h"
  },

  /* Precio según el país que elige en el formulario: Argentina = AR, Venezuela = VE, España = EUR, el resto = USD.
     Cada plan es un botón. Si una región queda sin precio o sin planes, ve la de dólares. */
  regiones: {
    USD: {
      lista: "USD 1.890", precio: "USD 1.228", descuento: "35% OFF",       // PENDIENTE: precio definitivo
      planes: [
        { boton: "Quiero Lifetime · USD 1.228", pago: "https://pay.hotmart.com/T104307778F?off=n1o1fxco&checkoutMode=10" }
      ],
      nota: "Pago seguro por Hotmart. Puedes pagar con tarjeta en cuotas según tu país. El acceso te llega al correo."
    },
    EUR: {
      lista: "USD 1.890", precio: "USD 1.228", descuento: "35% OFF", detalle: "≈ € 1.060 · Hotmart te cobra en euros", // PENDIENTE: precio fijo en euros
      planes: [
        { boton: "Quiero Lifetime", pago: "https://pay.hotmart.com/T104307778F?off=n1o1fxco&checkoutMode=10" }
      ],
      nota: "Pago seguro por Hotmart: te muestra el importe en euros antes de pagar. El acceso te llega al correo."
    },
    AR: {
      lista: "USD 1.890", precio: "USD 1.228", descuento: "35% OFF", detalle: "o en 6 cuotas en pesos con Mercado Pago", // PENDIENTE: precio en pesos y link de 6 cuotas
      planes: [
        { boton: "Pagar en 6 cuotas · Mercado Pago", pago: "https://wa.link/mdy1qb" },
        { boton: "Pagar con tarjeta internacional", pago: "https://pay.hotmart.com/T104307778F?off=n1o1fxco&checkoutMode=10" }
      ],
      nota: "Te pasamos el valor en pesos y el link de las 6 cuotas por WhatsApp."
    },
    VE: {
      lista: "USD 1.890", precio: "USD 1.228", descuento: "35% OFF", detalle: "en dólares o en bolívares con Pago Móvil", // PENDIENTE
      planes: [
        { boton: "Pagar en bolívares · Pago Móvil", pago: "https://wa.link/rbbk5h" },
        { boton: "Pagar en dólares con tarjeta", pago: "https://pay.hotmart.com/T104307778F?off=n1o1fxco&checkoutMode=10" }
      ],
      nota: "Para bolívares te pasamos el monto y los datos de Pago Móvil por WhatsApp."
    }
  },

  /* Catálogo (de accesolifetime.coachestetico.com). */
  catalogo: [
    { nombre: "Diplomados", detalle: "Programas internacionales de formación avanzada", cursos: [
      "Diplomado Internacional en Peeling Químico", "Diplomado Internacional en Aparatología",
      "Diplomado Internacional en Dermatocosmiatría", "Diplomado Dermatocosmiatría Internacional · Edición 2026",
      "Diplomado Internacional Crecimiento para Emprendedores Estéticos"] },
    { nombre: "Premium", detalle: "Formaciones intensivas y especializadas", cursos: [
      "Acné Expert Training", "Actualización de Anatomía del HIFU", "Envejecimiento Expert Training",
      "Formación en Cosmetología", "Actualización de Especialización en Cosmiatría", "Formación Profesional en Peeling Químico",
      "Master Training en Diagnóstico Estético Facial", "Melanosis Expert Training",
      "Actualización de Expert Training Microneedling PRO", "Consultor(a) Skin Care", "Formación Método Nutriskin"] },
    { nombre: "Esenciales", detalle: "Fundamentos y técnicas esenciales", cursos: [
      "Abordaje Inteligente Estrías", "Acné Activo con Dermapen", "Actualización en Despigmentación",
      "Actualización en Peeling Químico y Ácidos", "Electroestética Facial", "Hidrafacial", "Entrenamiento Lámpara Wood PRO",
      "Limpiezas Faciales", "Perfeccionamiento en Dermapen", "Plasma Pen", "Quimioexfoliación PRO", "Radiofrecuencias",
      "Tecnologías Corporales", "Tratamientos Domiciliares"] },
    { nombre: "Express", detalle: "Cursos rápidos y prácticos", cursos: [
      "Altafrecuencia", "Dermaplaning", "Fototerapia LED", "Hidrafacial en Acné Inflamatorio", "IPL - Luz Pulsada Intensa",
      "Microdermoabrasión", "Microneedling en Cuero Cabelludo", "Peeling Ultrasónico", "Ultrasonido 3 MHz"] },
    { nombre: "Masterclasses", detalle: "Sesiones magistrales especializadas", cursos: [
      "Inmersión en Secuelas Post Acné", "Manejo de la Pigmentación con Peeling Químico", "Rosácea y Acné",
      "Principios Activos con Dermapen", "Protocolos en Fototipos Altos", "Química Cosmética", "Rebrote Acneico",
      "Reestructuración en Pieles", "Diagnóstico 0 - Pre Peeling", "Técnicas de Aplicación del Peeling Químico + Ácido Glicólico"] },
    { nombre: "Clases Bonus", detalle: "Contenido exclusivo adicional", cursos: [
      "ABC Peeling Químico", "Complicaciones Acneicas", "Control Total de Acné Activo", "Esteticismo Facial",
      "Estrategia de Planificación en Casos de Acné", "Estrategia de Planificación en Casos de Manchas",
      "Estrategia Ortomolecular para Acné y Rosácea", "Hands On Ácidos y Peeling", "Inmersión en Biotipo Graso",
      "Lectura de Resultados Hormonales y Laboratorio", "Mapeo Facial para Acné y Melanosis", "Potenciales en Nasogenianos",
      "Soluciones para Cicatrices Post Acné", "Técnicas Despigmentantes", "Técnicas en Aparatologías", "Técnicas Lumínicas",
      "Técnicas en Peeling Químico", "Técnicas en Pieles Acneicas", "Técnicas en Rejuvenecimiento", "Domina Top 7 Ácidos"] }
  ],

  /* Planilla "Leads VSL Lifetime" (Apps Script en ventascoach5). Vacía = no guarda nada. */
  registroUrl: "https://script.google.com/macros/s/AKfycbw2YV3B5ylL2mjio0BV6__9CazHQChCDpN0Fzcnbt2N9u4Uo6w_Qg-kcXdHTltk9QiPHw/exec"
};
