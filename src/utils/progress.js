import { toDateKey } from './learning'

// Chispas que suma cada acción del docente (los "puntos" internos de educatech).
// No son puntaje docente: ese lo asigna la Junta de Clasificación.
export const POINTS = {
  lesson: 10,
  reflection: 20,
  module: 30,
  enroll: 15,
  resource: 5,
  certificate: 50,
}

// Niveles: chispas mínimas para alcanzar cada uno.
export const LEVELS = [
  { number: 1, title: 'Docente explorador', min: 0 },
  { number: 2, title: 'Docente curioso', min: 100 },
  { number: 3, title: 'Docente en formación', min: 250 },
  { number: 4, title: 'Docente innovador', min: 450 },
  { number: 5, title: 'Docente referente', min: 700 },
  { number: 6, title: 'Docente mentor', min: 1000 },
  { number: 7, title: 'Docente inspirador', min: 1400 },
]

const dayKeys = activities => [...new Set(
  activities
    .map(item => new Date(item.date))
    .filter(date => !Number.isNaN(date.getTime()))
    .map(toDateKey),
)].sort()

const previousDay = key => {
  const [year, month, day] = key.split('-').map(Number)
  return toDateKey(new Date(year, month - 1, day - 1))
}

export function getStreaks(activities, today = new Date()) {
  const days = dayKeys(activities)
  const set = new Set(days)
  let best = 0
  let run = 0
  let last = null
  days.forEach(key => {
    run = last && previousDay(key) === last ? run + 1 : 1
    best = Math.max(best, run)
    last = key
  })
  const todayKey = toDateKey(today)
  let cursor = set.has(todayKey) ? todayKey : previousDay(todayKey)
  let current = 0
  while (set.has(cursor)) {
    current += 1
    cursor = previousDay(cursor)
  }
  return { current, best, studiedToday: set.has(todayKey) }
}

export function getLevel(points) {
  const level = [...LEVELS].reverse().find(item => points >= item.min) ?? LEVELS[0]
  const next = LEVELS.find(item => item.min > points) ?? null
  const span = next ? next.min - level.min : 1
  return {
    ...level,
    points,
    nextLevel: next,
    pointsToNext: next ? next.min - points : 0,
    percentage: next ? Math.round(((points - level.min) / span) * 100) : 100,
  }
}

export function computeLearnerStats({ activities, certificates, enrolled, finished, applied = 0 }) {
  const count = type => activities.filter(item => item.type === type).length
  const counts = {
    lessons: count('lesson'),
    modules: count('module'),
    enrollments: count('enroll'),
    resources: count('resource'),
    reflections: count('reflection'),
    applied,
    certificates: certificates.length,
    finished: finished.length,
    enrolled: enrolled.length,
  }
  const points = counts.lessons * POINTS.lesson
    + counts.modules * POINTS.module
    + counts.enrollments * POINTS.enroll
    + counts.resources * POINTS.resource
    + counts.certificates * POINTS.certificate
    + counts.reflections * POINTS.reflection
  const streak = getStreaks(activities)

  const achievements = [
    { id: 'first-step', title: 'Primer paso', description: 'Completá tu primera lección', tone: 'violet', icon: 'play', current: counts.lessons, goal: 1 },
    { id: 'first-course', title: 'Primer curso', description: 'Finalizá un curso completo', tone: 'green', icon: 'book', current: Math.max(counts.finished, counts.certificates), goal: 1 },
    { id: 'streak-5', title: '5 días seguidos', description: 'Estudiá cinco días consecutivos', tone: 'amber', icon: 'zap', current: streak.best, goal: 5 },
    { id: 'classroom', title: 'Del curso al aula', description: 'Aplicá 3 ideas y contá cómo te fue', tone: 'amber', icon: 'lightbulb', current: applied, goal: 3 },
    { id: 'curious', title: 'Mente curiosa', description: 'Completá 10 lecciones', tone: 'blue', icon: 'sparkles', current: counts.lessons, goal: 10 },
    { id: 'explorer', title: 'Explorador digital', description: 'Inscribite en 3 cursos', tone: 'teal', icon: 'compass', current: counts.enrolled, goal: 3 },
    { id: 'lifelong', title: 'Formación continua', description: 'Obtené 3 certificados', tone: 'rose', icon: 'award', current: counts.certificates, goal: 3 },
  ].map(item => ({ ...item, unlocked: item.current >= item.goal, progress: Math.min(100, Math.round((item.current / item.goal) * 100)) }))

  const unlockedAt = id => {
    const relevant = { 'first-step': 'lesson', 'first-course': 'certificate', curious: 'lesson', explorer: 'enroll', lifelong: 'certificate', classroom: 'reflection' }[id]
    const dates = activities.filter(item => item.type === relevant).map(item => Date.parse(item.date)).filter(Boolean)
    return dates.length ? Math.max(...dates) : 0
  }
  const latestAchievement = achievements
    .filter(item => item.unlocked)
    .sort((a, b) => unlockedAt(b.id) - unlockedAt(a.id))[0] ?? null

  return { points, level: getLevel(points), streak, counts, achievements, latestAchievement }
}
