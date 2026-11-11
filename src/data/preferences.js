import { useMemo, useSyncExternalStore } from 'react'
import { currentProfile } from './profile.js'

export const educationLevels = ['Inicial', 'Primario', 'Secundario', 'Superior']
export const teachingAreas = ['Matemática', 'Lengua', 'Ciencias Naturales', 'Ciencias Sociales', 'Idiomas', 'Tecnología', 'Educación Artística', 'Educación Física', 'Otra']

const storageKey = `educatech:preferences:${currentProfile.email}`
const changeEvent = 'educatech:preferences-changed'

const subscribe = notify => {
  window.addEventListener('storage', notify)
  window.addEventListener(changeEvent, notify)
  return () => {
    window.removeEventListener('storage', notify)
    window.removeEventListener(changeEvent, notify)
  }
}

const readSnapshot = () => window.localStorage.getItem(storageKey)

function parsePreferences(raw) {
  if (raw === null) return { status: 'pending', levels: [], areas: [] }
  try {
    const stored = JSON.parse(raw)
    return {
      status: ['omitted', 'completed'].includes(stored.status) ? stored.status : 'pending',
      levels: Array.isArray(stored.levels) ? stored.levels.filter(level => educationLevels.includes(level)) : [],
      areas: Array.isArray(stored.areas) ? stored.areas.filter(area => teachingAreas.includes(area)) : [],
    }
  } catch {
    return { status: 'pending', levels: [], areas: [] }
  }
}

export function readPreferences() {
  return parsePreferences(readSnapshot())
}

function persist(preferences) {
  window.localStorage.setItem(storageKey, JSON.stringify(preferences))
  window.dispatchEvent(new Event(changeEvent))
}

export function savePreferences(levels, areas) {
  const validLevels = [...new Set(levels)].filter(level => educationLevels.includes(level))
  const validAreas = [...new Set(areas)].filter(area => teachingAreas.includes(area))
  if (validLevels.length === 0 || validAreas.length === 0) return false
  persist({ status: 'completed', levels: validLevels, areas: validAreas })
  return true
}

export function omitPreferences() {
  persist({ status: 'omitted', levels: [], areas: [] })
}

export function usePreferences() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot)
  return useMemo(() => parsePreferences(snapshot), [snapshot])
}
