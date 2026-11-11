// Puntaje docente: educatech NO otorga puntaje. Solo informa el estado de cada curso
// y estima, cuando existe una escala publicada, cuánto podría valorar la Junta de Clasificación.

// Estado de puntaje de cada curso. Lo carga el área de contenidos junto con el curso:
// agregar en courses.js `puntaje: { estado: 'tramite' }` o `puntaje: { estado: 'con', resolucion: 'Res. N.º …' }`.
export const PUNTAJE_ESTADOS = {
  con: { label: 'Con puntaje', short: 'Con puntaje oficial', tone: 'green', help: 'Tiene aval: la resolución figura en el certificado y la Junta lo puede valorar.' },
  tramite: { label: 'En trámite', short: 'Puntaje en trámite', tone: 'amber', help: 'Se pidió el aval y todavía no hay respuesta.' },
  sin: { label: 'Sin puntaje oficial', short: 'Sin puntaje oficial por ahora', tone: 'violet', help: 'Te sirve para tu aula y se suma a tu carpeta, pero no da puntaje.' },
}

export const coursePuntaje = course => {
  const estado = PUNTAJE_ESTADOS[course?.puntaje?.estado] ? course.puntaje.estado : 'sin'
  return { estado, resolucion: course?.puntaje?.resolucion ?? null, ...PUNTAJE_ESTADOS[estado] }
}

// Escalas publicadas. Se actualizan acá cuando cambia la norma.
// INFoD: Resolución N.º 1741/5 (MED) del Ministerio de Educación de Tucumán, 19/06/2026.
export const PUNTAJE_SCALES = {
  INFoD: {
    norma: 'Res. 1741/5 (MED)',
    rangos: [
      { desde: 20, hasta: 35, puntos: 1.5 },
      { desde: 36, hasta: 50, puntos: 2.3 },
      { desde: 51, hasta: 120, puntos: 2.62 },
      { desde: 121, hasta: 199, puntos: 3.1 },
      { desde: 200, hasta: 399, puntos: 3.9 },
      { desde: 400, hasta: Infinity, puntos: 6.3 },
    ],
  },
}

export const INSTITUTIONS = ['INFoD', 'FDCI (Ministerio de Educación de Tucumán)', 'Universidad', 'Otra institución']

// Devuelve la estimación o null cuando no hay una escala publicada para esa institución.
export function estimatePuntaje({ institution, hours }) {
  const scale = PUNTAJE_SCALES[institution]
  if (!scale) return null
  const range = scale.rangos.find(item => hours >= item.desde && hours <= item.hasta)
  return range ? { puntos: range.puntos, norma: scale.norma } : { puntos: 0, norma: scale.norma, belowMinimum: true }
}

export const formatPuntos = value => value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
