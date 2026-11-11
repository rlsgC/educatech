import { useSyncExternalStore } from 'react'
import { currentProfile } from './profile'

const changeEvent = 'educatech:dashboard-state-changed'
const userId = currentProfile.email || currentProfile.fullName
const storageKey = field => `educatech:${field}:${userId}`

const subscribe = notify => {
  window.addEventListener('storage', notify)
  window.addEventListener(changeEvent, notify)
  return () => {
    window.removeEventListener('storage', notify)
    window.removeEventListener(changeEvent, notify)
  }
}

const readList = field => {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey(field)))
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

const saveList = (field, value) => {
  window.localStorage.setItem(storageKey(field), JSON.stringify(value))
  window.dispatchEvent(new Event(changeEvent))
}

const snapshot = field => window.localStorage.getItem(storageKey(field)) || '[]'

export function useReminders() {
  const stored = useSyncExternalStore(subscribe, () => snapshot('reminders'))
  try {
    const reminders = JSON.parse(stored)
    return Array.isArray(reminders) ? reminders : []
  } catch {
    return []
  }
}

export function saveReminder(reminder) {
  const reminders = readList('reminders')
  const value = { ...reminder, id: reminder.id || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}` }
  const next = reminders.some(item => item.id === value.id)
    ? reminders.map(item => item.id === value.id ? value : item)
    : [...reminders, value]
  saveList('reminders', next)
}

export function deleteReminder(reminderId) {
  saveList('reminders', readList('reminders').filter(item => item.id !== reminderId))
}

export function useActivities() {
  const stored = useSyncExternalStore(subscribe, () => snapshot('activities'))
  try {
    const activities = JSON.parse(stored)
    return Array.isArray(activities) ? activities : []
  } catch {
    return []
  }
}

export function recordActivity(activity) {
  const activities = readList('activities')
  if (activities.some(item => item.id === activity.id)) return
  saveList('activities', [...activities, { ...activity, date: activity.date || new Date().toISOString() }])
}
