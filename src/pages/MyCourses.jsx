import { ArrowRight, Award, BookOpen, CalendarDays, Check, Clock, Download, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CourseCover from '../components/CourseCover'
import CourseWithdrawal from '../components/CourseWithdrawal'
import NextReminderCard from '../components/NextReminderCard'
import NextStepHero from '../components/NextStepHero'
import WeeklyGoal from '../components/WeeklyGoal'
import { courses } from '../data/courses'
import { useCertificates } from '../data/certificateState'
import { getCourseProgress, isCourseFinished, useEnrolledCourses } from '../data/courseState'
import { currentProfile } from '../data/profile'
import AchievementIcon from '../components/AchievementIcon'
import { categoryLabel, courseHours, getNextStep } from '../utils/learning'
import { useLearnerStats } from '../utils/useLearnerStats'

const filters = ['En progreso', 'Finalizados', 'Todos']

function downloadHistory(enrolled) {
  const lines = enrolled.map(course => {
    const progress = getCourseProgress(course)
    return `- ${course.title} (${course.duration}): ${isCourseFinished(course) ? 'Finalizado' : `En progreso, ${progress.percentage}%`}`
  })
  const content = `EDUCATECH - HISTORIAL DE FORMACIÓN\n\nDocente: ${currentProfile.fullName}\nFecha: ${new Intl.DateTimeFormat('es-AR').format(new Date())}\n\n${lines.join('\n') || 'Sin cursos inscriptos.'}\n`
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'historial-educatech.txt'
  link.click()
  URL.revokeObjectURL(url)
}

function Kpi({ icon: Icon, tone, value, label, badge }) {
  return (
    <div className="rd-card rd-kpi">
      <div className="rd-kpi-top"><span className={`rd-icon-tile tone-${tone}`}><Icon size={20} /></span>{badge && <span className="rd-badge">{badge}</span>}</div>
      <div><strong>{value}</strong><span>{label}</span></div>
    </div>
  )
}

function CourseRow({ course, onWithdraw }) {
  const progress = getCourseProgress(course)
  const finished = isCourseFinished(course)
  const percentage = finished ? 100 : progress.percentage
  return (
    <article className="rd-card rd-course-row">
      <CourseCover course={course} size="row" />
      <div className="rd-course-row-body">
        <div className="rd-course-row-top">
          <span className={`rd-category tone-text-${course.imageTone || 'violet'}`}>{categoryLabel(course.category)}</span>
          <span className={`rd-state ${finished ? 'done' : ''}`}>{finished ? 'Finalizado' : 'En progreso'}</span>
        </div>
        <h3>{course.title}</h3>
        <p>{finished ? 'Curso completado. ¡Felicitaciones!' : progress.nextContent ? `Siguiente: ${progress.nextContent.title}` : course.description}</p>
        <div className={`rd-progress ${finished ? 'done' : ''}`}><span><span style={{ width: `${percentage}%` }} /></span><strong>{percentage}%</strong></div>
        <div className="rd-course-row-foot">
          <span className="rd-muted">{finished ? 'Curso completo' : `${progress.completedModules} de ${progress.totalModules} módulos`} · {course.duration}</span>
          <div className="rd-course-row-actions">
            {!finished && <CourseWithdrawal course={course} onWithdraw={onWithdraw} />}
            {finished
              ? <Link className="rd-link" to="/carpeta">Ver certificado <ArrowRight size={16} /></Link>
              : <Link className="rd-link" to={`/cursos/${course.id}/aprender`}>Continuar <ArrowRight size={16} /></Link>}
          </div>
        </div>
      </div>
    </article>
  )
}

function YearProgress({ enrolled, certificates }) {
  const finishedCount = enrolled.filter(isCourseFinished).length
  const progressList = enrolled.map(course => ({ course, progress: getCourseProgress(course) }))
  const totalModules = progressList.reduce((sum, item) => sum + item.progress.totalModules, 0)
  const completedModules = progressList.reduce((sum, item) => sum + (isCourseFinished(item.course) ? item.progress.totalModules : item.progress.completedModules), 0)
  const percentage = enrolled.length ? Math.round((finishedCount / enrolled.length) * 100) : 0
  return (
    <section className="rd-card rd-side-card" aria-labelledby="year-title">
      <div className="rd-side-head">
        <div><span className="rd-eyebrow">Progreso anual</span><h2 id="year-title">{new Date().getFullYear()} en perspectiva</h2></div>
        <span className="rd-icon-tile tone-green"><Zap size={19} /></span>
      </div>
      <div className="rd-year">
        <span className="rd-ring rd-ring-lg" style={{ '--value': `${percentage}%` }} role="img" aria-label={`${percentage}% de tus cursos finalizados`}><span>{percentage}%</span></span>
        <dl>
          <div><dt><i className="dot-violet" />Cursos</dt><dd>{finishedCount}/{enrolled.length}</dd></div>
          <div><dt><i className="dot-teal" />Módulos</dt><dd>{completedModules}/{totalModules}</dd></div>
          <div><dt><i className="dot-amber" />Certificados</dt><dd>{certificates.length}</dd></div>
        </dl>
      </div>
    </section>
  )
}

function AchievementCard() {
  const { latestAchievement, achievements, points, level } = useLearnerStats()
  const nextGoal = achievements.filter(item => !item.unlocked).sort((a, b) => b.progress - a.progress)[0]
  const achievement = latestAchievement ?? nextGoal
  if (!achievement) return null
  const unlocked = Boolean(latestAchievement)
  return (
    <section className="rd-promo rd-achievement" aria-labelledby="achievement-title">
      <div className="rd-achievement-top"><span className="rd-promo-icon"><AchievementIcon name={achievement.icon} size={20} /></span><span className="rd-new">{unlocked ? 'Logrado' : `${achievement.current}/${achievement.goal}`}</span></div>
      <div>
        <span className="rd-achievement-label">{unlocked ? 'Último logro desbloqueado' : 'Tu próxima insignia'}</span>
        <h2 id="achievement-title">{achievement.title}</h2>
        <p>{unlocked ? `Sumaste ${points} chispas · Nivel ${level.number}` : achievement.description}</p>
      </div>
      <Link className="rd-link rd-link-dark" to="/perfil">Ver mis logros <ArrowRight size={16} /></Link>
    </section>
  )
}

function MyCourses() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedFilter = searchParams.get('estado') === 'finalizados' ? 'Finalizados' : 'En progreso'
  const [filter, setFilter] = useState(requestedFilter)
  const [message, setMessage] = useState('')
  const enrolled = useEnrolledCourses(courses)
  const certificates = useCertificates()
  const finished = isCourseFinished
  const active = enrolled.filter(course => !finished(course))
  const done = enrolled.filter(finished)
  const list = enrolled.filter(course => filter === 'Todos' || (filter === 'Finalizados' ? finished(course) : !finished(course)))
  const counts = { 'En progreso': active.length, Finalizados: done.length, Todos: enrolled.length }
  const hours = done.reduce((sum, course) => sum + courseHours(course), 0)
  const nextStep = getNextStep(active)

  const selectFilter = item => {
    setFilter(item)
    setSearchParams(item === 'Finalizados' ? { estado: 'finalizados' } : item === 'En progreso' ? { estado: 'en-progreso' } : {})
  }

  return (
    <div className="rd-page">
      <div className="rd-page-head">
        <div>
          <span className="rd-kicker">Tu espacio personal</span>
          <h1>Mis cursos</h1>
          <p>Tu progreso, tus próximos pasos y tus logros en un solo lugar.</p>
        </div>
        <button className="rd-btn rd-btn-dark" type="button" onClick={() => downloadHistory(enrolled)}><Download size={17} /> Descargar historial</button>
      </div>

      <div className="rd-kpis">
        <Kpi icon={BookOpen} tone="violet" value={active.length} label="Cursos en progreso" />
        <Kpi icon={Clock} tone="teal" value={`${hours} h`} label="Horas de formación completadas" />
        <Kpi icon={Check} tone="green" value={done.length} label="Cursos finalizados" />
        <Kpi icon={Award} tone="amber" value={certificates.length} label="Certificados" badge={certificates.length ? 'Listos' : null} />
      </div>

      <div className="rd-hero-row rd-hero-row-wide">
        <NextStepHero nextStep={nextStep} eyebrow="Tu siguiente paso" />
        <WeeklyGoal />
      </div>

      <div className="rd-layout">
        <section className="rd-main-col" aria-label="Listado de cursos">
          <div className="rd-list-toolbar">
            <div className="rd-tabs" role="tablist" aria-label="Estado de los cursos">
              {filters.map(item => (
                <button key={item} type="button" role="tab" aria-selected={filter === item} className={filter === item ? 'active' : ''} onClick={() => selectFilter(item)}>
                  {item} <span>{counts[item]}</span>
                </button>
              ))}
            </div>
            <span className="rd-muted">{list.length === 1 ? '1 curso' : `${list.length} cursos`}</span>
          </div>
          {message && <p className="withdrawal-status" role="status">{message}</p>}
          {list.length ? (
            <div className="rd-course-rows">
              {list.map(course => <CourseRow key={course.id} course={course} onWithdraw={() => setMessage('Te diste de baja del curso')} />)}
            </div>
          ) : (
            <div className="rd-card rd-empty">
              <h3>{filter === 'Finalizados' ? 'Todavía no finalizaste cursos' : 'No tenés cursos en esta sección'}</h3>
              <p>Explorá el catálogo y elegí tu próxima formación.</p>
              <Link className="rd-btn rd-btn-primary" to="/catalogo">Explorar catálogo <ArrowRight size={16} /></Link>
            </div>
          )}
        </section>

        <aside className="rd-side-col" aria-label="Resumen">
          <YearProgress enrolled={enrolled} certificates={certificates} />
          <AchievementCard />
          <NextReminderCard title="Próxima fecha clave" />
          <Link className="rd-card rd-side-link" to="/"><CalendarDays size={18} /> Ver calendario completo <ArrowRight size={16} /></Link>
        </aside>
      </div>
    </div>
  )
}

export default MyCourses
