import { ArrowRight, Compass, Play, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import CourseCover from './CourseCover'
import RobotPortal from './RobotPortal'

function robotTip(percentage) {
  if (percentage === 0) return '¡Arranquemos con la primera lección!'
  if (percentage < 40) return `¡Buen ritmo! Ya llevás ${percentage}%.`
  if (percentage <= 60) return '¡Dale que vas por la mitad!'
  return '¡Ya casi terminás! No aflojes.'
}

function NextStepHero({ nextStep, eyebrow = 'Continuá donde dejaste', visual = 'robot', headingId = 'next-step-title' }) {
  if (!nextStep) {
    return (
      <section className="rd-hero rd-hero-robot" aria-labelledby={headingId}>
        {visual === 'robot' && <RobotPortal size={170} className="rd-portal-hero" state="saludo" bubble="¿Buscamos tu próximo curso?" />}
        <div className="rd-hero-copy">
          <span className="rd-hero-eyebrow"><Compass size={14} /> Tu próximo paso</span>
          <h2 id={headingId}>Encontrá una propuesta para seguir aprendiendo</h2>
          <p>Elegí un curso que acompañe tus objetivos.</p>
          <Link className="rd-btn rd-btn-amber" to="/catalogo">Explorar catálogo <ArrowRight size={17} /></Link>
        </div>
      </section>
    )
  }
  const { course, content, progress } = nextStep
  return (
    <section className={`rd-hero ${visual === 'robot' ? 'rd-hero-robot' : ''}`} aria-labelledby={headingId}>
      {visual === 'robot'
        ? <RobotPortal size={170} className="rd-portal-hero" state="estudia" bubble={robotTip(progress.percentage)} />
        : <CourseCover course={course} size="hero" className="rd-hero-cover" />}
      <div className="rd-hero-copy">
        <span className="rd-hero-eyebrow"><Sparkles size={14} /> {eyebrow}</span>
        <h2 id={headingId}>{content.title}</h2>
        <p>{course.title} · {progress.completedModules} de {progress.totalModules} módulos completados</p>
        <div className="rd-hero-progress" aria-label={`Progreso del curso ${progress.percentage}%`}>
          <span><span style={{ width: `${progress.percentage}%` }} /></span>
          <strong>{progress.percentage}%</strong>
        </div>
        <Link className="rd-btn rd-btn-amber" to={`/cursos/${course.id}/aprender`}><Play size={16} fill="currentColor" /> Continuar lección</Link>
      </div>
    </section>
  )
}

export default NextStepHero
