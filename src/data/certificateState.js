import { useSyncExternalStore } from 'react'
import { currentProfile } from './profile'
import { certificates as legacyCertificates } from './resources'

const eventName = 'educatech:certificates-changed'
const storageKey = `educatech:certificates:${currentProfile.email || currentProfile.fullName}`
const subscribe = notify => {
  window.addEventListener('storage', notify)
  window.addEventListener(eventName, notify)
  return () => { window.removeEventListener('storage', notify); window.removeEventListener(eventName, notify) }
}
const readEarned = () => {
  try { const value = JSON.parse(window.localStorage.getItem(storageKey)); return Array.isArray(value) ? value : [] } catch { return [] }
}
const snapshot = () => window.localStorage.getItem(storageKey) || '[]'

export function earnSampleCertificate(course) {
  const current = readEarned()
  if (current.some(item => item.courseId === course.id)) return
  const date = new Intl.DateTimeFormat('es-AR').format(new Date())
  window.localStorage.setItem(storageKey, JSON.stringify([...current, { id: `sample-${course.id}`, courseId: course.id, course: course.title, date, sample: true }]))
  window.dispatchEvent(new Event(eventName))
}

export function useCertificates() {
  const stored = useSyncExternalStore(subscribe, snapshot)
  let earned = []
  try { earned = JSON.parse(stored) || [] } catch { /* Ignore malformed prototype storage. */ }
  return [...legacyCertificates, ...earned]
}

export function downloadCertificate(certificate) {
  const content = `EDUCATECH - CERTIFICADO DE MUESTRA\n\n${certificate.course}\n${certificate.sample ? 'Demostración sin validez oficial' : 'Registro del prototipo'}\nFecha: ${certificate.date}\nTitular: ${currentProfile.fullName}\n`
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `certificado-${certificate.courseId || certificate.id}.txt`
  link.click()
  URL.revokeObjectURL(url)
}
