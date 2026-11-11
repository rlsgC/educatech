import { ArrowRight, Award, BarChart3, Check, ChevronRight, Play, Plus, Sparkles, Star, Zap } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AchievementIcon from '../components/AchievementIcon'
import NextReminderCard from '../components/NextReminderCard'
import WeeklyGoal from '../components/WeeklyGoal'
import robotPoster from '../assets/mascot/robot-saludo.webp'
import robotVideo from '../assets/mascot/robot-saludo.mp4'
import { useCertificates } from '../data/certificateState'
import { courses } from '../data/courses'
import { isCourseFinished, readCourseVisitedAt, useEnrolledCourses } from '../data/courseState'
import { currentProfile } from '../data/profile'
import { getNextStep, greeting } from '../utils/learning'
import { useCountUp, useReducedMotion, useTypewriter } from '../utils/useMotion'
import { useLearnerStats } from '../utils/useLearnerStats'
import { useWeeklyGoal } from '../utils/useWeeklyGoal'
import { ActivitySection, CalendarCard, DashboardCourseCard, ResourcePromo } from './Dashboard'
import '../styles/animations.css'

function buildTips({ name, nextStep, weekly, stats }) {
  const tips = []
  if (nextStep) {
    const pending = nextStep.progress.totalContents - nextStep.progress.completedContents
    tips.push(`¡Hola, ${name}! Te ${pending === 1 ? 'queda 1 lección' : `quedan ${pending} lecciones`} para terminar “${nextStep.course.title}”. ¿Seguimos?`)
  } else {
    tips.push(`¡Hola, ${name}! Soy tu compañero en EducaTech. Elegí un curso del catálogo y empezamos juntos.`)
  }
  const remaining = Math.max(0, weekly.goal - weekly.done)
  tips.push(remaining === 0
    ? '¡Cumpliste tu objetivo de la semana! Sos un ejemplo para tus estudiantes.'
    : `Esta semana estudiaste ${weekly.done} ${weekly.done === 1 ? 'día' : 'días'}. Con ${remaining} más llegás a tu meta.`)
  tips.push(stats.level.nextLevel
    ? `Tenés ${stats.points} chispas. Te faltan ${stats.level.pointsToNext} para ser “${stats.level.nextLevel.title}”.`
    : `¡Llegaste al nivel máximo: ${stats.level.title}!`)
  if (stats.streak.current > 1) tips.push(`¡Llevás ${stats.streak.current} días seguidos estudiando! No cortes la racha.`)
  return tips
}

function TipBubble({ text, onNext, canSkip, autoAdvance }) {
  const { text: shown, done } = useTypewriter(text)
  useEffect(() => {
    if (!done || !autoAdvance) return undefined
    const timer = setTimeout(onNext, 6500)
    return () => clearTimeout(timer)
  }, [done, autoAdvance, onNext])
  return (
    <div className="ax-bubble" aria-live="polite">
      <p>{shown}<span className={`ax-caret ${done ? 'idle' : ''}`} aria-hidden="true" /></p>
      {canSkip && (
        <button type="button" onClick={onNext} aria-label="Ver otro consejo del robot">
          Otro consejo <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}

function RobotGuide({ tips }) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const next = useCallback(() => setIndex(current => current + 1), [])
  const text = tips[index % tips.length]

  return (
    <div className="ax-robot">
      <TipBubble key={index} text={text} onNext={next} canSkip={tips.length > 1} autoAdvance={!reduced && tips.length > 1} />
      <div className="ax-robot-figure">
        <video
          src={robotVideo}
          poster={robotPoster}
          autoPlay={!reduced}
          loop
          muted
          playsInline
          aria-label="Robot de EducaTech saludando"
        />
        <span className="ax-robot-shadow" aria-hidden="true" />
      </div>
    </div>
  )
}

function AnimatedStat({ icon: Icon, label, value, suffix = '', detail, to, tone, delay }) {
  const shown = useCountUp(value, { delay })
  return (
    <Link className="rd-card ax-stat ax-in" style={{ '--d': `${delay}ms` }} to={to} aria-label={`${label}: ${value}${suffix}`}>
      <span className={`rd-icon-tile tone-${tone} ax-stat-icon`}><Icon size={21} /></span>
      <span className="ax-stat-copy">
        <span>{label}</span>
        <strong>{shown}{suffix}</strong>
        <small>{detail}</small>
      </span>
    </Link>
  )
}

function NextBadge({ stats }) {
  const target = stats.achievements.filter(item => !item.unlocked).sort((a, b) => b.progress - a.progress)[0]
  if (!target) {
    return (
      <section className="ax-badge ax-in" style={{ '--d': '300ms' }} aria-labelledby="badge-title">
        <span className="ax-badge-icon"><Star size={22} /></span>
        <div><span className="rd-eyebrow">Insignias</span><h2 id="badge-title">¡Las desbloqueaste todas!</h2></div>
      </section>
    )
  }
  return (
    <section className="ax-badge ax-in" style={{ '--d': '300ms' }} aria-labelledby="badge-title">
      <div className="ax-badge-top">
        <span className="ax-badge-icon"><AchievementIcon name={target.icon} size={22} /></span>
        <span className="ax-badge-count">{Math.min(target.current, target.goal)}/{target.goal}</span>
      </div>
      <span className="ax-badge-label">Tu próxima insignia</span>
      <h2 id="badge-title">{target.title}</h2>
      <p>{target.description}</p>
      <div className="ax-badge-bar"><span style={{ width: `${target.progress}%` }} /></div>
      <i className="ax-spark s1" aria-hidden="true" /><i className="ax-spark s2" aria-hidden="true" /><i className="ax-spark s3" aria-hidden="true" />
    </section>
  )
}

function AnimatedDashboard() {
  const certificates = useCertificates()
  const enrolled = useEnrolledCourses(courses)
  const activeCourses = enrolled.filter(course => !isCourseFinished(course))
  const nextStep = getNextStep(activeCourses)
  const recentCourses = [...activeCourses].sort((a, b) => (Date.parse(readCourseVisitedAt(b.id)) || 0) - (Date.parse(readCourseVisitedAt(a.id)) || 0)).slice(0, 2)
  const approvedCount = enrolled.filter(isCourseFinished).length
  const weekly = useWeeklyGoal()
  const stats = useLearnerStats()
  const today = new Date()
  const dateLabel = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(today)
  const tips = buildTips({ name: currentProfile.firstName, nextStep, weekly, stats })

  return (
    <div className="rd-page home-dashboard ax-page">
      <section className="ax-hero ax-in" aria-labelledby="ax-hero-title">
        <span className="ax-orb o1" aria-hidden="true" />
        <span className="ax-orb o2" aria-hidden="true" />
        <span className="ax-ring-deco" aria-hidden="true" />
        <span className="ax-dot d1" aria-hidden="true" /><span className="ax-dot d2" aria-hidden="true" /><span className="ax-dot d3" aria-hidden="true" />
        <Sparkles className="ax-twinkle t1" size={22} aria-hidden="true" />
        <Sparkles className="ax-twinkle t2" size={16} aria-hidden="true" />

        <div className="ax-hero-copy">
          <span className="rd-kicker">{dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}</span>
          <h1 id="ax-hero-title">{greeting(today)}, <span className="ax-name">{currentProfile.firstName}</span></h1>
          <p className="ax-sub">Un nuevo paso para transformar tus clases.</p>

          {nextStep ? (
            <div className="ax-next">
              <span className="ax-next-label"><Play size={13} fill="currentColor" /> Continuá donde dejaste</span>
              <strong>{nextStep.content.title}</strong>
              <span className="rd-muted">{nextStep.course.title}</span>
              <div className="ax-next-progress" aria-label={`Progreso del curso ${nextStep.progress.percentage}%`}>
                <span><span style={{ width: `${nextStep.progress.percentage}%` }} /></span>
                <strong>{nextStep.progress.percentage}%</strong>
              </div>
              <Link className="rd-btn rd-btn-primary ax-shine" to={`/cursos/${nextStep.course.id}/aprender`}>Continuar lección <ArrowRight size={17} /></Link>
            </div>
          ) : (
            <div className="ax-next">
              <strong>Encontrá tu próxima formación</strong>
              <span className="rd-muted">Elegí un curso que acompañe tus objetivos.</span>
              <Link className="rd-btn rd-btn-primary ax-shine" to="/catalogo">Explorar catálogo <ArrowRight size={17} /></Link>
            </div>
          )}
        </div>

        <RobotGuide tips={tips} />
      </section>

      <div className="ax-stats" aria-label="Resumen de formación">
        <AnimatedStat icon={BarChart3} label="En progreso" value={activeCourses.length} detail="cursos activos" to="/mis-cursos?estado=en-progreso" tone="violet" delay={120} />
        <AnimatedStat icon={Check} label="Aprobados" value={approvedCount} detail="cursos finalizados" to="/mis-cursos?estado=finalizados" tone="green" delay={200} />
        <AnimatedStat icon={Award} label="Certificados" value={certificates.length} detail="listos para descargar" to="/carpeta" tone="amber" delay={280} />
        <AnimatedStat icon={Zap} label={`Nivel ${stats.level.number}`} value={stats.points} suffix=" chispas" detail={stats.level.title} to="/perfil" tone="rose" delay={360} />
      </div>

      <div className="rd-layout">
        <div className="rd-main-col">
          <section className="rd-card rd-panel ax-in" style={{ '--d': '420ms' }} aria-labelledby="ax-courses-title">
            <div className="rd-section-head">
              <div><h2 id="ax-courses-title">Mis cursos en progreso</h2><p>Un pequeño avance hoy cuenta mucho mañana.</p></div>
              <Link className="rd-link" to="/mis-cursos">Ver todos <ArrowRight size={16} /></Link>
            </div>
            <div className="rd-course-tiles ax-tiles">
              {recentCourses.map(course => <DashboardCourseCard course={course} key={course.id} />)}
              <Link className="rd-add-course" to="/catalogo">
                <span className="ax-plus"><Plus size={20} /></span>
                <strong>{recentCourses.length ? 'Sumá un nuevo curso' : 'Todavía no tenés cursos en progreso'}</strong>
                <small>Explorá el catálogo y elegí tu próxima formación.</small>
              </Link>
            </div>
          </section>

          <div className="rd-split ax-in" style={{ '--d': '520ms' }}>
            <ActivitySection />
            <ResourcePromo courseId={nextStep?.course.id} />
          </div>
        </div>

        <aside className="rd-side-col" aria-label="Planificación">
          <div className="ax-in" style={{ '--d': '220ms' }}><WeeklyGoal title={`${Math.min(weekly.done, weekly.goal)} de ${weekly.goal} días con estudio`} showRing /></div>
          <NextBadge stats={stats} />
          <div className="ax-in" style={{ '--d': '380ms' }}><CalendarCard activeCourses={activeCourses} /></div>
          <div className="ax-in" style={{ '--d': '460ms' }}><NextReminderCard /></div>
        </aside>
      </div>
    </div>
  )
}

export default AnimatedDashboard
