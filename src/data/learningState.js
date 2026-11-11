import { useSyncExternalStore } from 'react'
import { recordActivity } from './dashboardState'
import { currentProfile } from './profile'

// Estado del aprendizaje aplicado: pasos de cada lección, ideas que el docente
// decidió probar, cómo le fue, repasos y cursos de otras instituciones.
// Hoy vive en el navegador; en el backend (Spring Boot) serán tablas propias.

const changeEvent = 'educatech:learning-changed'
const storageKey = `educatech:learning:${currentProfile.email || currentProfile.fullName}`
const empty = { steps: {}, commitments: [], reflections: [], reviews: {}, missed: [], external: [], notices: null }

const subscribe = notify => {
  window.addEventListener('storage', notify)
  window.addEventListener(changeEvent, notify)
  return () => {
    window.removeEventListener('storage', notify)
    window.removeEventListener(changeEvent, notify)
  }
}

const snapshot = () => {
  try { return window.localStorage.getItem(storageKey) || '' } catch { return '' }
}

const parse = raw => {
  try {
    const value = JSON.parse(raw)
    return value && typeof value === 'object' ? { ...empty, ...value } : { ...empty }
  } catch {
    return { ...empty }
  }
}

const read = () => parse(snapshot())

const write = update => {
  const next = update(read())
  try { window.localStorage.setItem(storageKey, JSON.stringify(next)) } catch { /* almacenamiento no disponible */ }
  window.dispatchEvent(new Event(changeEvent))
}

const newId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`

export function useLearningState() {
  const raw = useSyncExternalStore(subscribe, snapshot)
  return parse(raw)
}

/* ---------- Pasos de la lección: mirar y recordar ---------- */
const stepKey = (courseId, lessonId) => `${courseId}:${lessonId}`

export function lessonSteps(state, courseId, lessonId) {
  return state.steps[stepKey(courseId, lessonId)] ?? { watched: false, quiz: false, applied: false }
}

export function markLessonStep(courseId, lessonId, step) {
  write(state => {
    const key = stepKey(courseId, lessonId)
    return { ...state, steps: { ...state.steps, [key]: { ...lessonSteps(state, courseId, lessonId), [step]: true } } }
  })
}

/* ---------- Ideas que el docente va a probar ---------- */
export const FOLLOW_UP_DAYS = 2

export function commitToIdea({ idea, courseId, lessonId }) {
  write(state => {
    const exists = state.commitments.some(item => item.ideaId === idea.id && item.courseId === courseId)
    const steps = { ...state.steps, [stepKey(courseId, lessonId)]: { ...lessonSteps(state, courseId, lessonId), applied: true } }
    if (exists) return { ...state, steps }
    const commitment = { id: newId(), ideaId: idea.id, title: idea.title, courseId, lessonId, date: new Date().toISOString() }
    return { ...state, steps, commitments: [...state.commitments, commitment] }
  })
}

export function pendingCommitments(state) {
  const answered = new Set(state.reflections.map(item => item.commitmentId))
  return state.commitments.filter(item => !answered.has(item.id))
}

// "¿Cómo te fue?" aparece en el Inicio a partir del segundo día después de elegir la idea.
export function followUpAt(commitment) {
  if (commitment.followUp) return new Date(commitment.followUp)
  const date = new Date(commitment.date)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + FOLLOW_UP_DAYS)
  return date
}

export function snoozeCommitment(commitmentId) {
  const tomorrow = new Date()
  tomorrow.setHours(0, 0, 0, 0)
  tomorrow.setDate(tomorrow.getDate() + 1)
  write(state => ({ ...state, commitments: state.commitments.map(item => item.id === commitmentId ? { ...item, followUp: tomorrow.toISOString() } : item) }))
}

export const dueCommitments = (state, now = new Date()) => pendingCommitments(state).filter(item => followUpAt(item) <= now)

export const REFLECTION_RESULTS = {
  funciono: 'Funcionó',
  'mas-o-menos': 'Más o menos',
  'no-pude': 'No pude usarla',
}

export function saveReflection({ commitment, result, note = '' }) {
  write(state => {
    if (state.reflections.some(item => item.commitmentId === commitment.id)) return state
    const reflection = { id: newId(), commitmentId: commitment.id, ideaId: commitment.ideaId, title: commitment.title, courseId: commitment.courseId, result, note: note.trim(), date: new Date().toISOString() }
    return { ...state, reflections: [...state.reflections, reflection] }
  })
  // "No pude usarla" también cuenta como reflexión, pero no como idea aplicada.
  recordActivity({
    id: `reflection:${commitment.id}`,
    type: 'reflection',
    title: 'Contaste cómo te fue en tu aula',
    detail: `${commitment.title} · ${REFLECTION_RESULTS[result]}`,
    courseId: commitment.courseId,
  })
}

// Para aprobar un curso hay que contar cómo te fue con al menos 2 ideas aplicadas.
export const REQUIRED_APPLIED_IDEAS = 2
export const appliedIdeas = (state, courseId) => state.reflections.filter(item => item.result !== 'no-pude' && (!courseId || item.courseId === courseId))

/* ---------- Repaso espaciado ---------- */
export function markReviewDone(dateKey) {
  write(state => ({ ...state, reviews: { ...state.reviews, [dateKey]: true } }))
}

/* ---------- Preguntas que costaron en el repaso del módulo ---------- */
// Se guardan las que fallaste la última vez que hiciste cada repaso; el Inicio
// te las vuelve a mostrar unos días después ("Repaso de 2 minutos").
export function saveReviewResult({ courseId, questionIds, missedIds }) {
  write(state => {
    const asked = new Set(questionIds)
    const kept = (state.missed ?? []).filter(item => !(item.courseId === courseId && asked.has(item.questionId)))
    const date = new Date().toISOString()
    return { ...state, missed: [...kept, ...missedIds.map(questionId => ({ courseId, questionId, date }))] }
  })
}

export function clearMissed(questionIds) {
  const done = new Set(questionIds)
  write(state => ({ ...state, missed: (state.missed ?? []).filter(item => !done.has(item.questionId)) }))
}

/* ---------- Cursos de otras instituciones (Mi carpeta) ---------- */
export function saveExternalCourse(course) {
  write(state => {
    const value = { ...course, id: course.id || newId(), addedAt: course.addedAt || new Date().toISOString() }
    const exists = state.external.some(item => item.id === value.id)
    return { ...state, external: exists ? state.external.map(item => item.id === value.id ? value : item) : [...state.external, value] }
  })
}

export function deleteExternalCourse(id) {
  write(state => ({ ...state, external: state.external.filter(item => item.id !== id) }))
}

/* ---------- Avisos ---------- */
export const DEFAULT_NOTICES = { reminders: true, followUp: true, officialEnrollments: true, catalogNews: false }
export const noticesOf = state => ({ ...DEFAULT_NOTICES, ...(state.notices || {}) })

export function setNotice(name, value) {
  write(state => ({ ...state, notices: { ...noticesOf(state), [name]: value } }))
}
