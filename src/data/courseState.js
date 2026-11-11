import { useSyncExternalStore } from 'react'
import { courseCurricula, courses } from './courses'
import { finalAssessments } from './finalAssessments'
import { currentProfile, isDemoProfile } from './profile'

const changeEvent = 'educatech:course-state-changed'
// La cuenta de prueba conserva sus claves de siempre; cada cuenta nueva guarda su avance aparte.
const key = (courseId, field) => `educatech:${field}:${courseId}${isDemoProfile ? '' : `:${currentProfile.email}`}`
// Los estados de ejemplo de los datos (En progreso, Finalizado…) solo valen para la cuenta de prueba.
const seedStatus = course => (isDemoProfile ? course?.status : null)
const subscribe = (notify) => {
  window.addEventListener('storage', notify)
  window.addEventListener(changeEvent, notify)
  return () => {
    window.removeEventListener('storage', notify)
    window.removeEventListener(changeEvent, notify)
  }
}
const save = (courseId, field, value) => {
  window.localStorage.setItem(key(courseId, field), value)
  window.dispatchEvent(new Event(changeEvent))
}

export function isCourseEnrolled(course) {
  const stored = window.localStorage.getItem(key(course.id, 'enrolled'))
  return stored === null
    ? ['En progreso', 'Finalizado', 'Certificado'].includes(seedStatus(course))
    : stored === 'true'
}

export function useCourseEnrollment(course) {
  return useSyncExternalStore(subscribe, () => isCourseEnrolled(course))
}

export function useEnrolledCourses(courses) {
  const enrolledState = useSyncExternalStore(subscribe, () => courses.filter(isCourseEnrolled).map(course => `${course.id}:${isCourseFinished(course)}`).join(','))
  return courses.filter(course => enrolledState.split(',').some(entry => entry.split(':')[0] === course.id))
}

export function isCourseAvailable(course) {
  const enrollmentOpen = course.schedule
    ? course.schedule.enrollmentStatus === 'Inscripcion abierta'
    : isDemoProfile ? ['Disponible', 'En progreso'].includes(course.status) : Boolean(course.status)
  return enrollmentOpen && !isCourseEnrolled(course) && !isCourseFinished(course)
}

export function useAvailableCourses(courses) {
  const availableIds = useSyncExternalStore(subscribe, () => courses.filter(isCourseAvailable).map(course => course.id).join(','))
  return courses.filter(course => availableIds.split(',').includes(course.id))
}

export function isCourseFinished(course) {
  if (['Finalizado', 'Certificado'].includes(seedStatus(course))) return true
  const lessons = (courseCurricula[course.id] ?? []).flatMap(module => module.lessons)
  const contentComplete = lessons.length > 0 && readCourseProgress(course.id, lessons).completed.length === lessons.length
  return finalAssessments[course.id] ? contentComplete && readFinalAssessment(course.id).passed : contentComplete
}

export function useCourseFinished(course) {
  return useSyncExternalStore(subscribe, () => isCourseFinished(course))
}

export function unenrollCourse(course) {
  if (!isCourseEnrolled(course) || isCourseFinished(course)) return false
  save(course.id, 'enrolled', 'false')
  return true
}

export function enrollCourse(courseId) {
  save(courseId, 'enrolled', 'true')
}

export function readCourseProgress(courseId, lessons) {
  let saved = {}
  const storedProgress = window.localStorage.getItem(key(courseId, 'progress'))
  try {
    saved = JSON.parse(storedProgress) || {}
  } catch { /* Ignore invalid saved progress. */ }
  const legacyCourseFinished = storedProgress === null
    && ['Finalizado', 'Certificado'].includes(seedStatus(courses.find(course => course.id === courseId)))
  const completed = legacyCourseFinished
    ? lessons.map(lesson => lesson.id)
    : Array.isArray(saved.completed)
    ? [...new Set(saved.completed.filter(id => lessons.some(lesson => lesson.id === id)))]
    : []
  const lastPending = lessons.find(lesson => lesson.id === saved.lastLessonId && !completed.includes(lesson.id))
  const lesson = lastPending || lessons.find(lesson => !completed.includes(lesson.id)) || lessons.at(-1)
  return { completed, lesson }
}

export function saveCourseProgress(courseId, completed, lastLessonId) {
  save(courseId, 'progress', JSON.stringify({ completed, lastLessonId }))
}

export function readFinalAssessment(courseId) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key(courseId, 'final-assessment')))
    return value && typeof value === 'object' ? value : { passed: false, bestScore: 0 }
  } catch {
    return { passed: false, bestScore: 0 }
  }
}

export function saveFinalAssessment(courseId, score, passed) {
  const current = readFinalAssessment(courseId)
  save(courseId, 'final-assessment', JSON.stringify({ passed: current.passed || passed, bestScore: Math.max(current.bestScore || 0, score) }))
}

export function markCourseVisited(courseId) {
  save('dashboard', 'last-visited-course', courseId)
  window.localStorage.setItem(key(courseId, 'last-visited-at'), new Date().toISOString())
}

export function readLastVisitedCourse() {
  return window.localStorage.getItem(key('dashboard', 'last-visited-course'))
}

export function readCourseVisitedAt(courseId) {
  return window.localStorage.getItem(key(courseId, 'last-visited-at'))
}

export function getCourseProgress(course) {
  const modules = courseCurricula[course.id] ?? []
  const contents = modules.flatMap(module => module.lessons)
  if (contents.length === 0) {
    return { percentage: 0, completedContents: 0, totalContents: 0, completedModules: 0, totalModules: 0, nextContent: null }
  }
  const progress = readCourseProgress(course.id, contents)
  const completedModules = modules.filter(module =>
    module.lessons.length > 0 && module.lessons.every(content => progress.completed.includes(content.id)),
  ).length
  return {
    percentage: Math.round((progress.completed.length / contents.length) * 100),
    completedContents: progress.completed.length,
    totalContents: contents.length,
    completedModules,
    totalModules: modules.length,
    nextContent: progress.completed.length < contents.length ? progress.lesson : null,
  }
}
