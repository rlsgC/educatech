import { getCourseProgress, readLastVisitedCourse } from '../data/courseState'

const categoryLabels = {
  'Tecnologia educativa': 'Tecnología educativa',
  Evaluacion: 'Evaluación',
  Metodologias: 'Metodologías',
  Inclusion: 'Inclusión',
  Gestion: 'Gestión',
}

export const categoryLabel = category => categoryLabels[category] ?? category

export const courseTone = course => course?.imageTone || course?.coverTone || 'violet'

export const courseHours = course => Number.parseInt(course?.duration, 10) || 0

export function getNextStep(activeCourses) {
  const resumable = activeCourses.filter(course => getCourseProgress(course).nextContent)
  const lastVisitedId = readLastVisitedCourse()
  const course = resumable.find(item => item.id === lastVisitedId) ?? resumable[0]
  return course ? { course, content: getCourseProgress(course).nextContent, progress: getCourseProgress(course) } : null
}

const pad = value => String(value).padStart(2, '0')
export const toDateKey = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export function getWeekActivity(activities, today = new Date()) {
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7))
  const activeDays = new Set(
    activities
      .map(item => new Date(item.date))
      .filter(date => !Number.isNaN(date.getTime()))
      .map(toDateKey),
  )
  return ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((label, index) => {
    const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index)
    const key = toDateKey(day)
    return { label, key, done: activeDays.has(key), isToday: key === toDateKey(today), isFuture: day > today }
  })
}

export function getUpcomingReminder(reminders, today = new Date()) {
  const todayKey = toDateKey(today)
  return [...reminders]
    .filter(item => item.date && item.date >= todayKey)
    .sort((a, b) => `${a.date} ${a.time || '99:99'}`.localeCompare(`${b.date} ${b.time || '99:99'}`))[0] ?? null
}

export function relativeDay(dateKey, today = new Date()) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const target = new Date(year, month - 1, day)
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diff = Math.round((target - base) / 86400000)
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Mañana'
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(target)
}

export function greeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 13) return 'Buen día'
  if (hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

export function initialsOf(fullName = '') {
  return fullName.split(' ').filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('')
}
