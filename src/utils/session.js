import { courseCurricula } from '../data/courses'

// Helpers para presentar "la sesión de hoy": una sola lección, con tiempo estimado y resultado esperado.

// Los títulos cargados en los datos todavía no tienen tildes: se corrigen solo al mostrarlos.
const ACCENTS = {
  transformacion: 'transformación', educacion: 'educación', introduccion: 'introducción', creacion: 'creación',
  evaluacion: 'evaluación', tecnologia: 'tecnología', practicas: 'prácticas', retroalimentacion: 'retroalimentación',
  planificacion: 'planificación', diseno: 'diseño', gestion: 'gestión', modulo: 'módulo', catedra: 'cátedra', inteligencia: 'inteligencia', inscripcion: 'inscripción', asincronicos: 'asincrónicos', sincronicos: 'sincrónicos',
}
export const withAccents = text => String(text || '').replace(/[A-Za-z]+/g, word => {
  const fixed = ACCENTS[word.toLowerCase()]
  if (!fixed) return word
  return word[0] === word[0].toUpperCase() ? fixed[0].toUpperCase() + fixed.slice(1) : fixed
})

export const cleanLessonTitle = title => withAccents(String(title || '').replace(/^\d+(\.\d+)*\.\s*/, ''))

// "Modulo 1 - Introduccion" → "Introducción" (el número se muestra aparte).
export const moduleName = title => withAccents(String(title || '').replace(/^m[oó]dulo\s*\d+\s*[-–:·]\s*/i, ''))

const parseVideoMinutes = duration => {
  const minutes = Number.parseInt(/(\d+)\s*min/.exec(duration || '')?.[1], 10) || 0
  const seconds = Number.parseInt(/(\d+)\s*s\b/.exec(duration || '')?.[1], 10) || 0
  return minutes + (seconds > 0 ? 1 : 0)
}

export function estimateMinutes(lesson) {
  if (!lesson) return 0
  if (lesson.type === 'review') return Math.max(5, (lesson.questions?.length || 3) * 2)
  // Video + un minuto para la idea clave (las preguntas están en el repaso del módulo).
  if (lesson.video?.duration) return parseVideoMinutes(lesson.video.duration) + 1
  return lesson.video ? 8 : 6
}

export function lessonFormat(lesson) {
  if (!lesson) return ''
  if (lesson.type === 'review') return `Repaso · ${lesson.questions?.length || 0} preguntas`
  if (lesson.video?.reflection) return 'Video + reflexión'
  return lesson.video ? 'Video + lectura' : 'Lectura guiada'
}

const lowerFirst = text => text ? text.charAt(0).toLowerCase() + text.slice(1) : ''

export function lessonOutcome(lesson) {
  if (!lesson) return ''
  if (lesson.type === 'review') return 'comprobar lo que aprendiste en el módulo y recibir una devolución inmediata.'
  const objective = lesson.objectives?.[0] || lesson.video?.objective
  if (!objective) return ''
  const text = lowerFirst(objective.trim())
  return /[.!?]$/.test(text) ? text : `${text}.`
}

export function lessonPosition(courseId, lessonId) {
  const lessons = (courseCurricula[courseId] ?? []).flatMap(module => module.lessons)
  const index = lessons.findIndex(lesson => lesson.id === lessonId)
  return { number: index + 1, total: lessons.length }
}
