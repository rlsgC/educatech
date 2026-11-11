import { ArrowRight, Award, BarChart3, BellPlus, BookOpen, Check, ChevronLeft, ChevronRight, Download, FileCheck2, FileText, GraduationCap, Pencil, Play, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CourseCover from '../components/CourseCover'
import NextReminderCard from '../components/NextReminderCard'
import NextStepHero from '../components/NextStepHero'
import ReminderForm from '../components/ReminderForm'
import WeeklyGoal from '../components/WeeklyGoal'
import { courses } from '../data/courses'
import { getCourseProgress, isCourseFinished, readCourseVisitedAt, useEnrolledCourses } from '../data/courseState'
import { deleteReminder, useActivities, useReminders } from '../data/dashboardState'
import { currentProfile } from '../data/profile'
import { useCertificates } from '../data/certificateState'
import { resources } from '../data/resources'
import { categoryLabel, getNextStep, greeting, toDateKey } from '../utils/learning'
import { useWeeklyGoal } from '../utils/useWeeklyGoal'
import { recordResourceDownload } from '../utils/activityLog'

const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const pad = value => String(value).padStart(2, '0')

function MetricCard({ icon: Icon, label, value, detail, to, tone }) {
  return (
    <Link className="rd-card rd-stat" to={to} aria-label={`${label}: ${value}`}>
      <span className={`rd-icon-tile tone-${tone}`}><Icon size={21} /></span>
      <span className="rd-stat-copy"><span>{label}</span><strong>{value}</strong><small>{detail}</small></span>
      <ChevronRight className="rd-stat-arrow" size={18} />
    </Link>
  )
}

export function DashboardCourseCard({ course }) {
  const progress = getCourseProgress(course)
  return (
    <Link className="rd-course-tile" to={`/cursos/${course.id}/aprender`}>
      <CourseCover course={course} label={categoryLabel(course.category)} />
      <div className="rd-course-tile-body">
        <h3>{course.title}</h3>
        <div className="rd-meta-row"><span>{progress.completedModules} de {progress.totalModules} módulos</span><span>{course.duration}</span></div>
        <div className="rd-progress"><span><span style={{ width: `${progress.percentage}%` }} /></span><strong>{progress.percentage}%</strong></div>
      </div>
    </Link>
  )
}

export function CalendarCard({ activeCourses }) {
  const today = useMemo(() => new Date(), [])
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(today))
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const reminders = useReminders()
  const startOffset = (new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay() + 6) % 7
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate()
  const cells = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]
  while (cells.length % 7) cells.push(null)
  const monthPrefix = `${visibleMonth.getFullYear()}-${pad(visibleMonth.getMonth() + 1)}`
  const monthReminders = reminders.filter(item => item.date?.startsWith(monthPrefix)).length
  const selectedReminders = reminders.filter(item => item.date === selectedDate).sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
  const moveMonth = amount => setVisibleMonth(current => {
    const next = new Date(current.getFullYear(), current.getMonth() + amount, 1)
    setSelectedDate(toDateKey(next))
    return next
  })
  const openForm = reminder => { setEditing(reminder || null); setFormOpen(true) }
  return (
    <section className="rd-card rd-side-card rd-calendar" aria-labelledby="calendar-title">
      <div className="rd-calendar-head">
        <h2 id="calendar-title">{monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</h2>
        <div>
          <button className="rd-icon-btn" type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior"><ChevronLeft size={17} /></button>
          <button className="rd-icon-btn" type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente"><ChevronRight size={17} /></button>
        </div>
      </div>
      <div className="rd-calendar-grid" role="grid" aria-label={`${monthNames[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`}>
        {weekDays.map((day, index) => <span className="rd-calendar-weekday" key={`${day}-${index}`}>{day}</span>)}
        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />
          const date = `${monthPrefix}-${pad(day)}`
          const hasReminder = reminders.some(reminder => reminder.date === date)
          return <button className={`${date === toDateKey(today) ? 'today' : ''} ${date === selectedDate ? 'selected' : ''}`} type="button" key={date} onClick={() => setSelectedDate(date)} aria-pressed={date === selectedDate} aria-label={`${day} de ${monthNames[visibleMonth.getMonth()]}${hasReminder ? ', con recordatorios' : ''}`}>{day}{hasReminder && <span className="rd-calendar-dot" aria-hidden="true" />}</button>
        })}
      </div>
      <p className="rd-calendar-foot"><span aria-hidden="true" />{monthReminders === 1 ? '1 recordatorio este mes' : `${monthReminders} recordatorios este mes`}</p>
      <div className="rd-reminder-list" aria-live="polite">
        {selectedReminders.length ? selectedReminders.map(reminder => <article key={reminder.id}><div><strong>{reminder.title}</strong><span>{reminder.time || 'Sin hora'}{reminder.courseId ? ` · ${courses.find(course => course.id === reminder.courseId)?.title || ''}` : ''}</span></div><button type="button" onClick={() => openForm(reminder)} aria-label={`Editar ${reminder.title}`}><Pencil size={15} /></button><button type="button" onClick={() => deleteReminder(reminder.id)} aria-label={`Eliminar ${reminder.title}`}><Trash2 size={15} /></button></article>) : <p>No tenés recordatorios para este día.</p>}
      </div>
      <button className="rd-btn rd-btn-primary rd-btn-block" type="button" onClick={() => openForm(null)}><BellPlus size={16} /> Agregar recordatorio</button>
      {formOpen && <ReminderForm reminder={editing} activeCourses={activeCourses} selectedDate={selectedDate} onClose={() => setFormOpen(false)} />}
    </section>
  )
}

function relativeTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const formatter = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' })
  if (Math.abs(seconds) < 60) return formatter.format(seconds, 'second')
  const minutes = Math.round(seconds / 60)
  if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  return Math.abs(hours) < 24 ? formatter.format(hours, 'hour') : formatter.format(Math.round(hours / 24), 'day')
}

export function ActivitySection() {
  const activities = useActivities().filter(item => !Number.isNaN(new Date(item.date).getTime())).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
  const icons = { lesson: Play, module: Check, certificate: FileCheck2, enroll: GraduationCap, resource: Download }
  return (
    <section className="rd-card rd-panel" aria-labelledby="activity-title">
      <div className="rd-section-head">
        <div><h2 id="activity-title">Actividad reciente</h2><p>Tus últimos pasos en EducaTech.</p></div>
      </div>
      {activities.length ? (
        <div className="rd-activity-list">
          {activities.map(activity => {
            const Icon = icons[activity.type] || BookOpen
            return <article key={activity.id}><span className={`rd-icon-tile activity-${activity.type}`}><Icon size={18} /></span><div><strong>{activity.title}</strong><span>{activity.detail}</span></div><time dateTime={activity.date}>{relativeTime(activity.date)}</time></article>
          })}
        </div>
      ) : <p className="rd-muted rd-empty-note">Todavía no hay actividad para mostrar. Cuando completes una lección, la vas a ver acá.</p>}
    </section>
  )
}

export function ResourcePromo({ courseId }) {
  const resource = resources.find(item => item.courseId === courseId && item.href) ?? resources.find(item => item.href)
  if (!resource) return null
  return (
    <section className="rd-promo" aria-labelledby="promo-title">
      <span className="rd-promo-icon"><FileText size={20} /></span>
      <div>
        <h2 id="promo-title">Un recurso para tu próxima clase</h2>
        <p>{resource.title.replace(/\.[a-z]+$/i, '')}</p>
      </div>
      <a className="rd-btn rd-btn-dark" href={resource.href} download onClick={() => recordResourceDownload(resource)}>Ver recurso <ArrowRight size={16} /></a>
    </section>
  )
}

function Dashboard() {
  const certificates = useCertificates()
  const enrolled = useEnrolledCourses(courses)
  const activeCourses = enrolled.filter(course => !isCourseFinished(course))
  const nextStep = getNextStep(activeCourses)
  const recentCourses = [...activeCourses].sort((a, b) => (Date.parse(readCourseVisitedAt(b.id)) || 0) - (Date.parse(readCourseVisitedAt(a.id)) || 0)).slice(0, 2)
  const approvedCount = enrolled.filter(isCourseFinished).length
  const weekly = useWeeklyGoal()
  const today = new Date()
  const dateLabel = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(today)

  return (
    <div className="rd-page home-dashboard">
      <div className="rd-page-head">
        <div>
          <span className="rd-kicker">{dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}</span>
          <h1>{greeting(today)}, {currentProfile.firstName}</h1>
          <p>Un nuevo paso para transformar tus clases.</p>
        </div>
        <span className="rd-pill-status"><Check size={16} strokeWidth={2.4} /> Meta semanal al {weekly.percentage}%</span>
      </div>

      <div className="rd-layout">
        <div className="rd-main-col">
          <div className="rd-hero-row">
            <NextStepHero nextStep={nextStep} headingId="welcome-title" />
            <div className="rd-stats" aria-label="Resumen de formación">
              <MetricCard icon={BarChart3} label="En progreso" value={activeCourses.length} detail="cursos activos" to="/mis-cursos?estado=en-progreso" tone="violet" />
              <MetricCard icon={Check} label="Aprobados" value={approvedCount} detail="cursos finalizados" to="/mis-cursos?estado=finalizados" tone="green" />
              <MetricCard icon={Award} label="Certificados" value={certificates.length} detail="listos para descargar" to="/carpeta" tone="amber" />
            </div>
          </div>

          <section className="rd-card rd-panel" aria-labelledby="courses-title">
            <div className="rd-section-head">
              <div><h2 id="courses-title">Mis cursos en progreso</h2><p>Un pequeño avance hoy cuenta mucho mañana.</p></div>
              <Link className="rd-link" to="/mis-cursos">Ver todos <ArrowRight size={16} /></Link>
            </div>
            <div className="rd-course-tiles">
              {recentCourses.map(course => <DashboardCourseCard course={course} key={course.id} />)}
              <Link className="rd-add-course" to="/catalogo">
                <span><Plus size={20} /></span>
                <strong>{recentCourses.length ? 'Sumá un nuevo curso' : 'Todavía no tenés cursos en progreso'}</strong>
                <small>Explorá el catálogo y elegí tu próxima formación.</small>
              </Link>
            </div>
          </section>

          <div className="rd-split">
            <ActivitySection />
            <ResourcePromo courseId={nextStep?.course.id} />
          </div>
        </div>

        <aside className="rd-side-col" aria-label="Planificación">
          <WeeklyGoal title={`${Math.min(weekly.done, weekly.goal)} de ${weekly.goal} días con estudio`} showRing />
          <CalendarCard activeCourses={activeCourses} />
          <NextReminderCard />
        </aside>
      </div>
    </div>
  )
}

export default Dashboard
