import { ArrowRight, CalendarClock, Check, Clock, Download, Flame, Pencil, Play, Plus, RotateCcw, Shuffle, Sparkles, Trash2, WifiOff } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AchievementIcon from '../components/AchievementIcon'
import HomeLearningCards from '../components/HomeLearningCards'
import ReminderForm from '../components/ReminderForm'
import { REFLECTION_RESULTS, dueCommitments, followUpAt, pendingCommitments, saveReflection, snoozeCommitment, useLearningState } from '../data/learningState'
import { classroomIdeas } from '../data/classroomIdeas'
import Mascot from '../components/Mascot'
import { RobotBubble } from '../components/RobotPortal'
import { courses } from '../data/courses'
import { getCourseProgress, isCourseFinished, readCourseVisitedAt, useEnrolledCourses } from '../data/courseState'
import { deleteReminder, saveReminder, useReminders } from '../data/dashboardState'
import { usePreferences } from '../data/preferences'
import { currentProfile } from '../data/profile'
import { courseIcons } from '../utils/courseIcons'
import { downloadIdeaPdf, ideaAudience, rankClassroomIdeas } from '../utils/classroomIdeas'
import { courseTone, getNextStep, greeting, relativeDay, toDateKey } from '../utils/learning'
import { cleanLessonTitle, estimateMinutes, lessonFormat, lessonOutcome, lessonPosition } from '../utils/session'
import { useReducedMotion } from '../utils/useMotion'
import { useLearnerStats } from '../utils/useLearnerStats'
import { useWeeklyGoal } from '../utils/useWeeklyGoal'

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`

// Racha en pausa: ya había estudiado antes, pero hoy no hay racha activa.
const streakPaused = streak => streak.current === 0 && streak.best > 0

function sessionTip({ minutes, streak }) {
  if (streak.studiedToday) return '¡Ya estudiaste hoy! Una lección más y seguís sumando chispas.'
  if (streakPaused(streak)) return `¡Te extrañé! Con ${minutes} minutos volvemos a encender tu racha.`
  if (streak.current > 0) return `Con ${minutes} minutos hoy mantenés tu racha de ${plural(streak.current, 'día', 'días')}. ¡Vamos!`
  return `Con ${minutes} minutos hoy encendés tu racha. ¡Vamos!`
}

/* 1 · Tu sesión de hoy */
function TodaySession({ nextStep, streak }) {
  if (!nextStep) {
    return (
      <section className="rd-today" aria-labelledby="today-title">
        <div className="rd-today-copy">
          <span className="rd-today-eyebrow">Tu sesión de hoy</span>
          <h2 id="today-title">Elegí tu próximo curso</h2>
          <p className="rd-today-outcome">No tenés lecciones pendientes. Explorá el catálogo y sumá una nueva formación para seguir aprendiendo.</p>
          <div className="rd-today-actions">
            <Link className="rd-btn rd-btn-primary rd-btn-lg" to="/catalogo">Explorar catálogo <ArrowRight size={18} /></Link>
          </div>
        </div>
        <div className="rd-today-robot">
          <RobotBubble>¿Buscamos juntos tu próximo curso?</RobotBubble>
          <Mascot state="saludo" className="rd-today-mascot" />
        </div>
      </section>
    )
  }

  const { course, content } = nextStep
  const minutes = estimateMinutes(content)
  const position = lessonPosition(course.id, content.id)
  const outcome = lessonOutcome(content)
  return (
    <section className="rd-today" aria-labelledby="today-title">
      <div className="rd-today-copy">
        <span className="rd-today-eyebrow">Tu sesión de hoy</span>
        <h2 id="today-title">{cleanLessonTitle(content.title)}</h2>
        <p className="rd-today-context">{course.title} · Lección {position.number} de {position.total}</p>
        <div className="rd-today-chips">
          <span className="key"><Clock size={14} /> {minutes} minutos<span className="sr-only"> estimados</span></span>
          <span>{lessonFormat(content)}</span>
        </div>
        {outcome && <p className="rd-today-outcome"><strong>Al terminar vas a poder</strong> {outcome}</p>}
        <div className="rd-today-actions">
          <Link className="rd-btn rd-btn-primary rd-btn-lg" to={`/cursos/${course.id}/aprender`}><Play size={16} fill="currentColor" /> Empezar sesión</Link>
          <Link className="rd-link" to={`/cursos/${course.id}`}>Elegir otra lección</Link>
        </div>
      </div>
      <div className="rd-today-robot">
        <RobotBubble>{sessionTip({ minutes, streak })}</RobotBubble>
        <Mascot state={streakPaused(streak) ? 'duerme' : 'estudia'} className="rd-today-mascot" />
      </div>
    </section>
  )
}

/* 3 · Seguí con tus cursos */
function ContinueCourses({ activeCourses }) {
  const list = [...activeCourses]
    .sort((a, b) => (Date.parse(readCourseVisitedAt(b.id)) || 0) - (Date.parse(readCourseVisitedAt(a.id)) || 0))
    .slice(0, 3)
  return (
    <section className="rd-card rd-home-card" aria-labelledby="continue-title">
      <div className="rd-home-head">
        <h2 id="continue-title">Seguí con tus cursos</h2>
        <Link className="rd-link" to="/mis-cursos">Ver todos <ArrowRight size={16} /></Link>
      </div>
      {list.length ? (
        <div className="rd-continue-list">
          {list.map(course => {
            const progress = getCourseProgress(course)
            const [Icon] = courseIcons[course.id] ?? [Play]
            const next = progress.nextContent
            return (
              <Link key={course.id} className={`rd-continue-row tone-${courseTone(course)}`} to={`/cursos/${course.id}/aprender`}>
                <span className="rd-continue-icon" aria-hidden="true"><Icon size={22} /></span>
                <span className="rd-continue-body">
                  <strong>{course.title}</strong>
                  {next
                    ? <span className="rd-continue-next"><span>Próximo: {cleanLessonTitle(next.title)}</span><span>· {estimateMinutes(next)} min</span></span>
                    : <span className="rd-continue-next"><span>Evaluación final pendiente</span></span>}
                  <span className="rd-continue-bar" aria-hidden="true"><span style={{ width: `${progress.percentage}%` }} /></span>
                </span>
                <strong className="rd-continue-pct" aria-label={`Progreso ${progress.percentage}%`}>{progress.percentage}%</strong>
              </Link>
            )
          })}
        </div>
      ) : (
        <Link className="rd-continue-empty" to="/catalogo">
          <span><Plus size={20} /></span>
          <strong>Todavía no tenés cursos en progreso</strong>
          <small>Explorá el catálogo y elegí tu próxima formación.</small>
        </Link>
      )}
    </section>
  )
}

/* 4 · Llevalo al aula: una sola tarjeta que cambia según el momento */

// Mazo de fichas: cada ficha conserva su nodo (key = posición) para que al cambiar
// de lugar la transición CSS la lleve de un estado a otro y se pueda interrumpir.
const DECK_SLOTS = [[-1, 'out'], [0, 'front'], [1, 'back'], [2, 'next']]

function IdeaDeck({ ideas, index }) {
  return (
    <div className="rd-deck" aria-hidden="true">
      {DECK_SLOTS.map(([offset, slot]) => {
        const position = index + offset
        if (position < 0) return null
        const idea = ideas[position % ideas.length]
        return (
          <div key={position} className={`rd-deck-sheet slot-${slot}`}>
            <span>Ficha de actividad</span>
            <strong>{idea.title}</strong>
            <i /><i />
            <div><b className="tone-green" /><b className="tone-rose" /><b className="tone-blue" /></div>
          </div>
        )
      })}
    </div>
  )
}

// El texto nuevo entra apenas el viejo casi desapareció (no espera al final de la salida).
const TEXT_SWAP_AT_MS = 90
const HEIGHT_EASE = 'cubic-bezier(.32, .72, 0, 1)'

function IdeaSuggestion({ nextStep, activeCourses }) {
  const preferences = usePreferences()
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0) // ficha al frente del mazo
  const [shown, setShown] = useState(0) // idea cuyo texto se muestra
  const [phase, setPhase] = useState('idle') // idle | leaving | entering
  const [download, setDownload] = useState('idle')
  const indexRef = useRef(0)
  const leavingRef = useRef(false)
  const swapRef = useRef(null)
  const fromHeight = useRef(null)
  const timers = useRef({})
  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])

  // La altura del bloque de texto acompaña el cambio en lugar de saltar.
  useLayoutEffect(() => {
    const el = swapRef.current
    const from = fromHeight.current
    fromHeight.current = null
    if (!el || from == null) return undefined
    const to = el.offsetHeight
    if (Math.abs(to - from) < 1) return undefined
    const reset = () => {
      el.style.height = ''
      el.style.overflow = ''
      el.style.transition = ''
    }
    el.style.height = `${from}px`
    el.style.overflow = 'hidden'
    el.getBoundingClientRect()
    el.style.transition = `height 340ms ${HEIGHT_EASE}`
    el.style.height = `${to}px`
    const onEnd = event => { if (event.target === el && event.propertyName === 'height') reset() }
    el.addEventListener('transitionend', onEnd)
    const fallback = setTimeout(reset, 420)
    return () => {
      clearTimeout(fallback)
      el.removeEventListener('transitionend', onEnd)
      reset()
    }
  }, [shown])

  const ideas = rankClassroomIdeas({
    courseId: nextStep?.course.id,
    activeCourseIds: activeCourses.map(course => course.id),
    preferences,
  })
  const idea = ideas[shown % ideas.length]
  if (!idea) return null
  const { level, area } = ideaAudience(idea, preferences)
  const hasPreferences = preferences.status === 'completed' && (preferences.levels.length > 0 || preferences.areas.length > 0)
  const preferenceLabel = [...preferences.levels, ...preferences.areas].slice(0, 3).join(' · ')
  const fromLesson = nextStep && idea.courseIds.includes(nextStep.course.id)
  const reason = fromLesson
    ? `Basada en tu última lección${hasPreferences ? ` y en tus preferencias (${preferenceLabel})` : ''}.`
    : hasPreferences ? `Basada en tus preferencias (${preferenceLabel}).` : null

  const later = (name, fn, ms) => {
    clearTimeout(timers.current[name])
    timers.current[name] = setTimeout(fn, ms)
  }

  const commitText = () => {
    if (!leavingRef.current) return
    leavingRef.current = false
    clearTimeout(timers.current.commit)
    setShown(indexRef.current)
    setPhase('entering')
  }

  const showNext = () => {
    indexRef.current += 1
    setIndex(indexRef.current) // el mazo responde en el mismo instante del clic
    setDownload('idle')
    if (reduced) {
      setShown(indexRef.current)
      setPhase('entering')
      return
    }
    if (leavingRef.current) return // ya está saliendo: mostrará la última idea elegida
    leavingRef.current = true
    fromHeight.current = swapRef.current?.offsetHeight ?? null
    setPhase('leaving')
    later('commit', commitText, TEXT_SWAP_AT_MS)
  }

  const handleDownload = async () => {
    clearTimeout(timers.current.download)
    setDownload('busy')
    try {
      await downloadIdeaPdf(idea, preferences)
      setDownload('done')
      later('download', () => setDownload('idle'), 2600)
    } catch {
      setDownload('error')
    }
  }

  const downloadLabel = {
    idle: <><Download size={16} /> Descargar ficha</>,
    busy: <><Download size={16} /> Generando…</>,
    done: <><Check size={16} strokeWidth={3} /> Ficha descargada</>,
    error: <><RotateCcw size={16} /> Reintentar descarga</>,
  }[download]

  return (
    <section className="rd-classroom" aria-labelledby="classroom-title">
      <div className="rd-classroom-copy">
        <span className="rd-classroom-eyebrow">Llevalo al aula{ideas.length > 1 && <span className="rd-classroom-count"> · Idea {(shown % ideas.length) + 1} de {ideas.length}</span>}</span>
        <div
          key={shown}
          ref={swapRef}
          className={`rd-classroom-swap is-${phase}`}
        >
          <h2 id="classroom-title" aria-live="polite">{idea.title}</h2>
          <p>{idea.summary}</p>
          <div className="rd-classroom-chips">
            <span className="dark">{level} · {area}</span>
            <span><Clock size={13} /> {idea.minutes} min</span>
            <span>{idea.grouping}</span>
            {idea.offline && <span><WifiOff size={13} /> Sin conexión</span>}
          </div>
        </div>
        <div className="rd-classroom-actions">
          <button className={`rd-btn rd-btn-dark is-${download}`} type="button" onClick={handleDownload} disabled={download === 'busy'} aria-live="polite">{downloadLabel}</button>
          {ideas.length > 1 && <button className="rd-btn rd-btn-soft-amber" type="button" onClick={showNext}><Shuffle size={16} /> Ver otra idea</button>}
        </div>
        {download === 'error' && <p className="rd-classroom-error" role="alert">No se pudo generar la ficha. Probá de nuevo.</p>}
        <small className="rd-classroom-reason">
          {reason ?? <>Elegí tu nivel y tu área en <Link to="/perfil">Mi perfil</Link> para recibir ideas a tu medida.</>}
        </small>
      </div>
      <IdeaDeck ideas={ideas} index={index} />
    </section>
  )
}

const weekdayLong = new Intl.DateTimeFormat('es-AR', { weekday: 'long' })

function askDay(commitment) {
  const at = followUpAt(commitment)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.round((at - today) / 86400000)
  return days <= 1 ? 'Mañana' : `El ${weekdayLong.format(at)}`
}

// 2 · Ya la elegiste / 3 · A los 2 días: ¿cómo te fue?
function IdeaFollowUp({ commitment, isDue, more, onAnswered }) {
  const preferences = usePreferences()
  const [busy, setBusy] = useState(false)
  const idea = classroomIdeas.find(item => item.id === commitment.ideaId)
  const answer = result => {
    saveReflection({ commitment, result })
    onAnswered(result)
  }
  const download = async () => {
    setBusy(true)
    try { await downloadIdeaPdf(idea, preferences) } finally { setBusy(false) }
  }

  return (
    <section className={`rd-classroom ${isDue ? 'is-asking' : 'is-waiting'}`} aria-labelledby="classroom-title">
      <div className="rd-classroom-copy">
        <span className="rd-classroom-eyebrow">Llevalo al aula</span>
        {isDue ? (
          <>
            <h2 id="classroom-title">¿Probaste “{commitment.title}” con tus alumnos?</h2>
            <div className="rd-classroom-answers" role="group" aria-label="Cómo resultó">
              <button className="rd-btn rd-btn-dark" type="button" onClick={() => answer('funciono')}>{REFLECTION_RESULTS.funciono}</button>
              <button className="rd-btn rd-btn-soft-amber" type="button" onClick={() => answer('mas-o-menos')}>{REFLECTION_RESULTS['mas-o-menos']}</button>
              <button className="rd-btn rd-btn-soft-amber" type="button" onClick={() => { snoozeCommitment(commitment.id); onAnswered('snooze') }}>Todavía no</button>
            </div>
            <small className="rd-classroom-reason">Un toque y listo.{more > 0 ? ` Después te preguntamos por ${more === 1 ? 'otra idea' : `${more} ideas más`}.` : ''}</small>
          </>
        ) : (
          <>
            <span className="rd-classroom-kicker">Esta semana probás</span>
            <h2 id="classroom-title">{commitment.title}</h2>
            <p className="rd-classroom-when"><CalendarClock size={18} aria-hidden="true" /><span><strong>{askDay(commitment)}</strong> te preguntamos acá cómo te fue.</span></p>
            {idea && (
              <div className="rd-classroom-actions">
                <button className="rd-btn rd-btn-dark" type="button" onClick={download} disabled={busy}><Download size={16} /> {busy ? 'Generando…' : 'Descargar ficha'}</button>
              </div>
            )}
          </>
        )}
      </div>
      {idea && <IdeaDeck ideas={[idea]} index={0} />}
    </section>
  )
}

const THANKS = {
  funciono: '¡Qué bueno! Lo sumamos a tu impacto en el aula.',
  'mas-o-menos': 'Gracias por contarlo. Probar y ajustar también es aprender.',
  snooze: 'Dale, mañana te volvemos a preguntar.',
}

function ClassroomIdea(props) {
  const learning = useLearningState()
  const [thanks, setThanks] = useState(null)
  const pending = pendingCommitments(learning)
  const due = dueCommitments(learning)
  const commitment = due[0] ?? pending.at(-1)
  return (
    <>
      {thanks && <p className="rd-classroom-thanks" role="status"><Check size={16} strokeWidth={3} aria-hidden="true" /> {THANKS[thanks]}</p>}
      {commitment
        ? <IdeaFollowUp key={commitment.id} commitment={commitment} isDue={due.includes(commitment)} more={due.length - 1} onAnswered={setThanks} />
        : <IdeaSuggestion {...props} />}
    </>
  )
}

/* 2 · Tu semana */
const weekdayShort = new Intl.DateTimeFormat('es-AR', { weekday: 'short' })

function dateTile(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return { weekday: weekdayShort.format(date).replace('.', '').toUpperCase(), day }
}

function NextBadgeRow({ achievements }) {
  const target = achievements.filter(item => !item.unlocked).sort((a, b) => b.progress - a.progress)[0]
  if (!target) {
    return (
      <div className="rd-hweek-badge">
        <span className="rd-hweek-badge-icon"><Sparkles size={20} /></span>
        <div><strong>¡Desbloqueaste todas las insignias!</strong></div>
      </div>
    )
  }
  const missing = target.goal - target.current
  return (
    <Link className="rd-hweek-badge" to="/perfil" aria-label={`Próxima insignia: ${target.title}. ${target.description}.`}>
      <span className="rd-hweek-badge-icon"><AchievementIcon name={target.icon} size={20} /></span>
      <div>
        <strong>{missing === 1 ? `A 1 paso de “${target.title}”` : `Próxima insignia: “${target.title}”`}</strong>
        <small>{target.description} · {Math.min(target.current, target.goal)}/{target.goal}</small>
        <span className="rd-hweek-badge-bar" aria-hidden="true"><span style={{ width: `${target.progress}%` }} /></span>
      </div>
    </Link>
  )
}


function YourWeek({ activeCourses, stats }) {
  const weekly = useWeeklyGoal()
  const reminders = useReminders()
  const [form, setForm] = useState(null)
  const [knownIds, setKnownIds] = useState(null)
  const [removed, setRemoved] = useState(null)
  const timers = useRef({})
  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), [])
  const later = (name, fn, ms) => {
    clearTimeout(timers.current[name])
    timers.current[name] = setTimeout(fn, ms)
  }
  // Guarda qué recordatorios existían para resaltar el que se agrega.
  const rememberCurrent = () => setKnownIds(new Set(reminders.map(item => item.id)))
  const openForm = reminder => {
    rememberCurrent()
    setForm({ reminder })
  }
  const closeForm = () => {
    setForm(null)
    later('highlight', () => setKnownIds(null), 1800)
  }
  const remove = reminder => {
    deleteReminder(reminder.id)
    setRemoved(reminder)
    later('undo', () => setRemoved(null), 6000)
  }
  const undo = () => {
    rememberCurrent()
    saveReminder(removed)
    setRemoved(null)
    later('highlight', () => setKnownIds(null), 1800)
  }
  const todayKey = toDateKey(new Date())
  const upcoming = reminders
    .filter(item => item.date && item.date >= todayKey)
    .sort((a, b) => `${a.date} ${a.time || '99:99'}`.localeCompare(`${b.date} ${b.time || '99:99'}`))
    .slice(0, 3)
  const streakDays = stats.streak.current

  return (
    <section className="rd-card rd-home-card rd-hweek" aria-labelledby="week-title">
      <div className="rd-hweek-top">
        <div>
          <span className="rd-eyebrow">Tu semana</span>
          <h2 id="week-title">{Math.min(weekly.done, weekly.goal)} de {weekly.goal} días con estudio</h2>
        </div>
        <span className="rd-hweek-streak" title="Días seguidos con estudio"><Flame size={15} fill="currentColor" /> {plural(streakDays, 'día', 'días')}</span>
      </div>

      <ol className="rd-hweek-days" aria-label="Días de esta semana">
        {weekly.week.map(day => {
          const number = Number(day.key.slice(-2))
          const state = day.done ? 'done' : day.isToday ? 'today' : day.isFuture ? 'future' : 'missed'
          const label = `${day.label}: ${day.done ? 'con estudio' : day.isToday ? 'hoy, sin estudio todavía' : day.isFuture ? 'próximo' : 'sin estudio'}`
          return (
            <li key={day.key} className={state}>
              <span aria-hidden="true">{day.label}</span>
              <b aria-hidden="true">{day.done ? <Check size={15} strokeWidth={3} /> : number}</b>
              <span className="sr-only">{label}</span>
              <i aria-hidden="true" />
            </li>
          )
        })}
      </ol>

      <div className="rd-hweek-reminders">
        <div className="rd-hweek-reminders-head">
          <strong>Próximos recordatorios</strong>
          <button className="rd-icon-btn" type="button" onClick={() => openForm(null)} aria-label="Agregar recordatorio"><Plus size={16} /></button>
        </div>
        {upcoming.length ? upcoming.map((reminder, position) => {
          const tile = dateTile(reminder.date)
          const course = courses.find(item => item.id === reminder.courseId)
          return (
            <article key={reminder.id} className={`${position === 0 ? 'first' : ''} ${knownIds && !knownIds.has(reminder.id) ? 'is-new' : ''}`}>
              <span className="rd-date-tile" aria-hidden="true">{tile.weekday}<b>{tile.day}</b></span>
              <div>
                <strong>{reminder.title}</strong>
                <span className="sr-only">{relativeDay(reminder.date)}, </span>
                <span>{reminder.time || 'Todo el día'}{course ? ` · ${course.title}` : ''}</span>
              </div>
              <button type="button" onClick={() => openForm(reminder)} aria-label={`Editar ${reminder.title}`}><Pencil size={14} /></button>
              <button type="button" onClick={() => remove(reminder)} aria-label={`Eliminar ${reminder.title}`}><Trash2 size={14} /></button>
            </article>
          )
        }) : <p className="rd-muted">No tenés recordatorios próximos. Agendá un momento para estudiar.</p>}
        <div aria-live="polite">
          {removed && (
            <p className="rd-undo">
              <span>Eliminaste “{removed.title}”.</span>
              <button type="button" onClick={undo}><RotateCcw size={14} /> Deshacer</button>
            </p>
          )}
        </div>
      </div>

      <NextBadgeRow achievements={stats.achievements} />

      {form && <ReminderForm reminder={form.reminder} activeCourses={activeCourses} selectedDate={todayKey} onClose={closeForm} />}
    </section>
  )
}

function Home() {
  const enrolled = useEnrolledCourses(courses)
  const activeCourses = enrolled.filter(course => !isCourseFinished(course))
  const nextStep = getNextStep(activeCourses)
  const stats = useLearnerStats()
  const today = new Date()
  const dateLabel = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(today).replace(',', '')

  return (
    <div className="rd-page rd-home">
      <div className="rd-home-greeting">
        <h1>{greeting(today)}, {currentProfile.firstName}</h1>
        <span>{dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}</span>
      </div>

      <TodaySession nextStep={nextStep} streak={stats.streak} />

      <div className="rd-home-grid">
        <div className="rd-home-main">
          <HomeLearningCards />
          <ContinueCourses activeCourses={activeCourses} />
          <ClassroomIdea nextStep={nextStep} activeCourses={activeCourses} />
        </div>
        <YourWeek activeCourses={activeCourses} stats={stats} />
      </div>
    </div>
  )
}

export default Home
