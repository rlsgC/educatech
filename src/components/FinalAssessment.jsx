import { ArrowRight, Award, Brain, Check, Clock, Download, Folder, Lock, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import LessonQuiz from './LessonQuiz'
import Mascot from './Mascot'
import { RobotBubble } from './RobotPortal'
import { RobotMark } from './BrandLogo'
import { courses } from '../data/courses'
import { useCertificates } from '../data/certificateState'
import { getCourseProgress, isCourseFinished, useEnrolledCourses } from '../data/courseState'
import { coursePuntaje } from '../data/puntaje'
import { currentProfile } from '../data/profile'
import { describeCertificate, downloadCertificatePdf } from '../utils/certificates'
import { courseIcons } from '../utils/courseIcons'
import { withAccents } from '../utils/session'

function Requirement({ done, title, detail }) {
  return (
    <div className={`rd-final-req ${done ? 'is-done' : ''}`}>
      <span className="rd-final-req-mark" aria-hidden="true">{done ? <Check size={16} strokeWidth={3} /> : <Lock size={15} />}</span>
      <span><strong>{title}<span className="sr-only">{done ? ' (cumplido)' : ' (pendiente)'}</span></strong><small>{detail}</small></span>
    </div>
  )
}

function CoursePassed({ course, score, total, contentCount, applied }) {
  const certificate = useCertificates().map(describeCertificate).find(item => item.courseData?.id === course.id)
  const next = useEnrolledCourses(courses).find(item => item.id !== course.id && !isCourseFinished(item))
  const nextProgress = next ? getCourseProgress(next) : null
  const [NextIcon] = (next && courseIcons[next.id]) || [Award]
  const [busy, setBusy] = useState(false)
  const puntaje = coursePuntaje(course)
  const hoursText = String(course.teachingHours || course.duration || '')
  const hours = Number.parseInt(hoursText.match(/\d+/)?.[0] ?? '0', 10)
  const download = async () => {
    setBusy(true)
    try { await downloadCertificatePdf(certificate) } finally { setBusy(false) }
  }

  return (
    <div className="rd-final">
      <section className="rd-final-hero is-passed" aria-labelledby="final-title">
        <div className="rd-final-hero-copy">
          <span className="rd-final-eyebrow">Curso aprobado</span>
          <h1 id="final-title">¡Terminaste “{course.title}”!</h1>
          <p>{score ? <>Respondiste bien <strong>{score} de {total}</strong> en la evaluación final.</> : 'Aprobaste la evaluación final.'}</p>
        </div>
        <Mascot state="celebra" once className="rd-final-bot" />
      </section>

      <section className="rd-card rd-final-cert">
        <div className="rd-final-cert-paper" aria-hidden="true">
          <div>
            <span>Certificado de finalización</span>
            <strong>{course.title}</strong>
            <small>{currentProfile.fullName} · {withAccents(course.teachingHours || course.duration)}</small>
            <span className="rd-final-cert-foot"><b>{certificate?.code ?? ''}</b><RobotMark size={28} /></span>
          </div>
        </div>
        <div className="rd-final-cert-copy">
          <h2>Tu certificado ya está en Mi carpeta</h2>
          <p>
            Tiene un código para verificarlo.{' '}
            {puntaje.estado === 'con' ? `Este curso tiene puntaje oficial (${puntaje.resolucion}).` : 'Es un certificado de muestra: este curso todavía no tiene puntaje oficial.'}
          </p>
          <div className="rd-final-actions">
            {certificate && <button className="rd-btn rd-btn-primary" type="button" onClick={download} disabled={busy}><Download size={17} /> {busy ? 'Generando…' : 'Descargar certificado'}</button>}
            <Link className="rd-btn rd-btn-soft" to="/carpeta"><Folder size={17} /> Ver Mi carpeta</Link>
          </div>
        </div>
      </section>

      <section className="rd-final-takeaways" aria-labelledby="takeaways-title">
        <h2 id="takeaways-title">Lo que te llevás</h2>
        <div>
          <span className="tone-violet"><strong>{contentCount}</strong>lecciones y repasos</span>
          <span className="tone-amber"><strong>{applied}</strong>{applied === 1 ? 'idea probada en tu aula' : 'ideas probadas en tu aula'}</span>
          <span className="tone-green"><strong>{hours} h</strong>{/c[aá]tedra/i.test(hoursText) ? 'cátedra de formación' : 'de formación'}</span>
        </div>
      </section>

      {next && (
        <section className="rd-card rd-final-next">
          <span className={`rd-step-tile tone-blue is-solid`} aria-hidden="true"><NextIcon size={22} /></span>
          <div>
            <span>Para seguir</span>
            <strong>{withAccents(next.title)}</strong>
            <small>{nextProgress?.percentage ? `Vas ${nextProgress.percentage}%` : 'Ya te inscribiste'} · {next.duration}</small>
          </div>
          <Link className="rd-btn rd-btn-dark" to={`/cursos/${next.id}/aprender`}>Continuar <ArrowRight size={17} /></Link>
        </section>
      )}
    </div>
  )
}

// Evaluación final: último paso del temario, con su propia pantalla.
function FinalAssessment({ assessment, course, initialResult, ready, contentDone, contentDetail, ideasDone, ideasDetail, contentCount, applied, onResult }) {
  const [result, setResult] = useState(initialResult)
  const [view, setView] = useState(initialResult.passed ? 'passed' : 'intro')
  const total = assessment.questions.length

  const finish = ({ correct }) => {
    const next = { score: correct, passed: correct >= assessment.requiredCorrect }
    setResult(current => ({ ...current, ...next }))
    setView(next.passed ? 'passed' : 'failed')
    onResult(next)
  }

  if (view === 'passed') return <CoursePassed course={course} score={result.score ?? result.bestScore} total={total} contentCount={contentCount} applied={applied} />

  if (view === 'quiz') {
    return (
      <div className="rd-final">
        <section className="rd-card rd-module-review" aria-label="Evaluación final">
          <LessonQuiz questions={assessment.questions} title="Evaluación final" subtitle={`Aprobás con ${assessment.requiredCorrect} de ${total}. Podés reintentar.`} showResult={false} onDone={finish} />
        </section>
      </div>
    )
  }

  const failed = view === 'failed'
  return (
    <div className="rd-final">
      <section className="rd-final-hero" aria-labelledby="final-title">
        <div className="rd-final-hero-copy">
          <span className="rd-final-eyebrow">Cierre del curso</span>
          <h1 id="final-title">{failed ? `Te faltó poco: ${result.score} de ${total}` : 'Evaluación final'}</h1>
          <p>{failed
            ? `Para aprobar necesitás ${assessment.requiredCorrect} respuestas correctas. Repasá las explicaciones y probá de nuevo cuando quieras.`
            : `${total} preguntas que repasan todo el curso. Al aprobarla, tu certificado queda en Mi carpeta.`}</p>
        </div>
        <div className="rd-final-robot">
          <RobotBubble>{failed ? 'No pasa nada: se puede reintentar.' : ready ? '¡Llegaste al final! Tranqui, se puede reintentar.' : 'Ya casi: te falta poco para rendirla.'}</RobotBubble>
          <Mascot state={failed ? 'duda' : 'saludo'} once className="rd-final-bot" />
        </div>
      </section>

      <div className="rd-final-facts">
        <span><span className="rd-step-tile tone-violet is-solid" aria-hidden="true"><Clock size={18} /></span><span><strong>{Math.max(5, total)} minutos</strong><small>Sin límite de tiempo</small></span></span>
        <span><span className="rd-step-tile tone-blue is-solid" aria-hidden="true"><Brain size={18} /></span><span><strong>{total} preguntas</strong><small>De todo el curso</small></span></span>
        <span><span className="rd-step-tile tone-amber is-solid" aria-hidden="true"><Award size={18} /></span><span><strong>Aprobás con {assessment.requiredCorrect}</strong><small>Podés reintentar</small></span></span>
      </div>

      <section className="rd-card rd-final-ready" aria-labelledby="final-ready-title">
        <h2 id="final-ready-title">{ready ? 'Ya cumpliste todo para rendirla' : 'Para rendirla te falta'}</h2>
        <Requirement done={contentDone} title="Contenido completo" detail={contentDetail} />
        <Requirement done={ideasDone} title="2 ideas probadas en tu aula" detail={ideasDetail} />
        <div className="rd-final-ready-foot">
          <small>{coursePuntaje(course).estado === 'con' ? 'Certificado con puntaje oficial' : 'Certificado de muestra · sin puntaje oficial por ahora'}</small>
          <button className="rd-btn rd-btn-primary rd-btn-lg" type="button" onClick={() => setView('quiz')} disabled={!ready}>
            {failed ? <><RotateCcw size={18} /> Reintentar</> : <>Empezar evaluación <ArrowRight size={18} /></>}
          </button>
        </div>
      </section>
    </div>
  )
}

export default FinalAssessment
