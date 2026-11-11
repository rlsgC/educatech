export const gamification = {
  streakDays: 7,
  points: 320,
  level: {
    number: 3,
    title: 'Docente en formacion',
    currentPoints: 320,
    nextLevelPoints: 400,
  },
  platformProgress: [
    { label: 'Cursos completados', current: 3, total: 5 },
    { label: 'Horas de formacion', current: 60, total: 120 },
    { label: 'Certificados obtenidos', current: 3, total: 8 },
  ],
  weeklyChallenges: [
    { id: 1, title: 'Completa una leccion', points: 20, completed: true },
    { id: 2, title: 'Explora un nuevo recurso', points: 10, completed: false },
    { id: 3, title: 'Finaliza un modulo', points: 30, completed: false },
  ],
  achievements: [
    { id: 1, title: 'Primer curso', tone: 'green', unlocked: true },
    { id: 2, title: '5 dias seguidos', tone: 'amber', unlocked: true },
    { id: 3, title: 'Explorador digital', tone: 'blue', unlocked: false },
    { id: 4, title: 'Formacion continua', tone: 'violet', unlocked: false },
  ],
}
