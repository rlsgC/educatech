import { ArrowLeft, ArrowRight, Award, BookOpen, Brain, CalendarDays, Check, ChevronDown, Clock, Compass, Lightbulb, MapPin, Milestone, Play, Users, Video } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { RobotBubble } from '../components/RobotPortal'
import { courseCurricula, courses } from '../data/courses'
import { enrollCourse, getCourseProgress, useCourseEnrollment } from '../data/courseState'
import { recordActivity } from '../data/dashboardState'
import { coursePuntaje } from '../data/puntaje'
import { categoryLabel, courseTone } from '../utils/learning'
import { cleanLessonTitle, moduleName, withAccents } from '../utils/session'

const OBJECTIVE_TONES = ['violet', 'blue', 'green', 'amber']
const LESSON_TONES = ['violet', 'blue', 'teal', 'rose']
const HOW = [
  { icon: Play, tone: 'violet', title: 'Videos cortos', text: 'Cada lección es un video y una idea clave.' },
  { icon: Brain, tone: 'blue', title: 'Un repaso por módulo', text: 'Preguntas para no olvidar lo importante.' },
  { icon: Lightbulb, tone: 'amber', title: 'Ideas para tu aula', text: 'Una propuesta al cerrar cada módulo.' },
  { icon: Award, tone: 'green', title: 'Certificado', text: 'Al aprobar la evaluación final.' },
]

const shortDate = text => {
  const [day, month, year] = String(text).split('/')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return month ? `${Number(day)} ${months[Number(month) - 1]} ${year}` : text
}

function CourseDetail() {
  const { courseId } = useParams()
  const mainCourse = courses.find(course => course.id === courseId)
  return mainCourse ? <CourseDetailContent key={mainCourse.id} course={mainCourse} /> : <p>Curso no encontrado.</p>
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="rd-cd-fact">
      <span className="rd-step-tile tone-violet" aria-hidden="true"><Icon size={16} /></span>
      <span><small>{label}</small><strong>{value}</strong></span>
    </div>
  )
}

function Syllabus({ modules }) {
  const [open, setOpen] = useState(() => ({ 0: true }))
  return (
    <div className="rd-temario">
      {modules.map((module, index) => {
        const lessons = module.lessons.filter(lesson => lesson.type !== 'review')
        const review = module.lessons.find(lesson => lesson.type === 'review')
        const isOpen = Boolean(open[index])
        const panelId = `cd-module-${index}`
        return (
          <section className={`rd-temario-module ${isOpen ? 'is-open is-current' : ''}`} key={module.title}>
            <button className="rd-temario-head" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(current => ({ ...current, [index]: !isOpen }))}>
              <span className="rd-temario-num" aria-hidden="true">{index + 1}</span>
              <span className="rd-temario-copy">
                <strong><span className="sr-only">Módulo {index + 1}: </span>{moduleName(module.title)}</strong>
                <small>{lessons.length} {lessons.length === 1 ? 'lección' : 'lecciones'}{review ? ' + repaso' : ''}</small>
              </span>
              <ChevronDown className="rd-temario-chev" size={18} aria-hidden="true" />
            </button>
            {isOpen && (
              <div className="rd-temario-items" id={panelId}>
                {lessons.map((lesson, position) => (
                  <div className="rd-temario-item is-static" key={lesson.id}>
                    <span className={`rd-step-tile tone-${LESSON_TONES[position % LESSON_TONES.length]}`} aria-hidden="true"><Video size={15} /></span>
                    <span className="rd-temario-title">{cleanLessonTitle(lesson.title)}</span>
                  </div>
                ))}
                {review && (
                  <div className="rd-temario-item is-static">
                    <span className="rd-step-tile tone-amber" aria-hidden="true"><Brain size={15} /></span>
                    <span className="rd-temario-title">Repaso del módulo · {review.questions?.length ?? 0} preguntas</span>
                  </div>
                )}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

function CourseDetailContent({ course }) {
  const navigate = useNavigate()
  const isEnrolled = useCourseEnrollment(course)
  const modules = courseCurricula[course.id] ?? []
  const lessonCount = modules.flatMap(module => module.lessons).filter(lesson => lesson.type !== 'review').length
  const reviewCount = modules.filter(module => module.lessons.some(lesson => lesson.type === 'review')).length
  const progress = isEnrolled ? getCourseProgress(course) : null
  const puntaje = coursePuntaje(course)
  const tone = courseTone(course)
  const hours = withAccents(course.teachingHours || course.duration)
  const category = categoryLabel(course.category)
  const levels = course.audience?.niveles ?? []
  const areas = (course.audience?.areas ?? []).filter(area => area !== 'Todas').map(withAccents)
  const schedule = course.schedule

  const goBack = () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate('/catalogo')
  }

  const handleEnroll = () => {
    if (!isEnrolled) {
      enrollCourse(course.id)
      recordActivity({ id: `enroll:${course.id}`, type: 'enroll', title: 'Te inscribiste en un curso', detail: course.title, courseId: course.id })
    }
    navigate(`/cursos/${course.id}/aprender`)
  }

  const enrollLabel = isEnrolled ? (progress?.percentage ? `Continuar · vas ${progress.percentage}%` : 'Empezar el curso') : 'Inscribirme'
  const bubble = isEnrolled
    ? (progress?.percentage ? `¡Qué bueno verte! Ya vas ${progress.percentage}% del curso.` : '¡Ya estás inscripto! Cuando quieras, arrancamos.')
    : `¡Hola! Son ${lessonCount} lecciones cortas y ${modules.length} ${modules.length === 1 ? 'idea' : 'ideas'} para llevar a tu aula.`

  return (
    <div className="rd-page rd-cd">
      <nav className="rd-cd-nav" aria-label="Ubicación">
        <button className="rd-cd-back" type="button" onClick={goBack}><ArrowLeft size={18} /> Volver</button>
        <ol className="rd-cd-crumbs">
          <li><Link to="/catalogo">Catálogo</Link></li>
          <li><Link to="/catalogo">{category}</Link></li>
          <li aria-current="page">{withAccents(course.title)}</li>
        </ol>
      </nav>

      <section className={`rd-cd-hero tone-${tone}`} aria-labelledby="course-title">
        <div className="rd-cd-hero-copy">
          <span className="rd-cd-eyebrow">{category}</span>
          <h1 id="course-title">{withAccents(course.title)}</h1>
          <p>{course.description}</p>
          <div className="rd-cd-chips">
            <span className="dark"><Clock size={15} /> {hours}</span>
            {lessonCount > 0 && <span><BookOpen size={15} /> {lessonCount} lecciones · {modules.length} {modules.length === 1 ? 'módulo' : 'módulos'}</span>}
            <span><Compass size={15} /> {course.modality}</span>
            <span className={`rd-puntaje tone-${puntaje.tone}`}>{puntaje.label}</span>
          </div>
          <div className="rd-cd-cta">
            <button className="rd-btn rd-btn-primary rd-btn-lg" type="button" onClick={handleEnroll}>{enrollLabel} <ArrowRight size={18} /></button>
          </div>
        </div>
        <div className="rd-cd-robot">
          <RobotBubble>{bubble}</RobotBubble>
          <Mascot state="saludo" className="rd-cd-bot" />
        </div>
      </section>

      <div className="rd-cd-grid">
        <div className="rd-cd-main">
          {course.objectives?.length > 0 && (
            <section className="rd-card rd-cd-section" aria-labelledby="cd-learn">
              <h2 id="cd-learn">Lo que vas a aprender</h2>
              <div className="rd-cd-objectives">
                {course.objectives.map((objective, index) => (
                  <div key={objective}>
                    <span className={`rd-step-tile tone-${OBJECTIVE_TONES[index % OBJECTIVE_TONES.length]} is-solid`} aria-hidden="true"><Check size={17} strokeWidth={3} /></span>
                    <span>{objective}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {modules.length > 0 && (
            <section className="rd-card rd-cd-section" aria-labelledby="cd-syllabus">
              <div className="rd-cd-section-head">
                <h2 id="cd-syllabus">Temario</h2>
                <span>{modules.length} {modules.length === 1 ? 'módulo' : 'módulos'} · {lessonCount} lecciones · {reviewCount} {reviewCount === 1 ? 'repaso' : 'repasos'} · evaluación final</span>
              </div>
              <Syllabus modules={modules} />
            </section>
          )}

          <section className="rd-cd-how" aria-labelledby="cd-how">
            <h2 id="cd-how">Cómo es el curso</h2>
            <div>
              {HOW.map(({ icon: Icon, tone: itemTone, title, text }) => (
                <div key={title}>
                  <span className={`rd-step-tile tone-${itemTone} is-solid`} aria-hidden="true"><Icon size={20} /></span>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="rd-card rd-cd-side" aria-labelledby="cd-side">
          <h2 id="cd-side">Este curso</h2>
          <Fact icon={Clock} label="Duración" value={hours} />
          <Fact icon={Compass} label="Modalidad" value={course.modality === 'Autogestionado' ? 'Autogestionado, a tu ritmo' : course.modality} />
          {levels.length > 0 && <Fact icon={Users} label="Para" value={`Docentes de ${levels.join(', ').replace(/, ([^,]*)$/, ' y $1')}`} />}
          {schedule && (
            <>
              <span className="rd-cd-status">{withAccents(schedule.enrollmentStatus)}</span>
              <Fact icon={CalendarDays} label="Fechas" value={`${shortDate(schedule.startDate)} al ${shortDate(schedule.endDate)}`} />
              {schedule.meetings && <Fact icon={Milestone} label="Encuentros" value={withAccents(schedule.meetings)} />}
              {schedule.place && <Fact icon={MapPin} label="Lugar" value={schedule.place} />}
            </>
          )}
          {areas.length > 0 && (
            <div className="rd-cd-areas"><small>Áreas</small><div>{areas.map(area => <span key={area}>{area}</span>)}</div></div>
          )}
          <div className="rd-cd-puntaje">
            <span className={`rd-puntaje tone-${puntaje.tone}`}>{puntaje.estado === 'con' ? `Con puntaje · ${puntaje.resolucion}` : puntaje.label}</span>
            <span>{puntaje.estado === 'sin' ? 'Te sirve para tu aula y suma horas a tu carpeta, pero todavía no da puntaje docente.' : puntaje.help}</span>
          </div>
          <small className="rd-cd-note">Oferta formativa de demostración. No implica resolución ni aval oficial.</small>
        </aside>
      </div>
    </div>
  )
}

export default CourseDetail
