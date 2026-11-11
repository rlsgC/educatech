import { ArrowRight, CalendarClock, Check, Clock, Download, Lightbulb, RotateCcw, Shuffle, WifiOff } from 'lucide-react'
import { useState } from 'react'
import Mascot from './Mascot'
import { REQUIRED_APPLIED_IDEAS, appliedIdeas, commitToIdea, followUpAt, useLearningState } from '../data/learningState'
import { usePreferences } from '../data/preferences'
import { downloadIdeaPdf, ideaAudience, rankClassroomIdeas } from '../utils/classroomIdeas'

const longDate = date => new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)

/* Idea para el aula: una propuesta por módulo, al cerrar el repaso. Es el único
   lugar del recorrido donde se propone; en el Inicio se hace el seguimiento. */
export function ModuleIdea({ courseId, moduleId, moduleIndex = 0, moduleCount = 1 }) {
  const preferences = usePreferences()
  const learning = useLearningState()
  const [index, setIndex] = useState(moduleIndex)
  const [busy, setBusy] = useState(false)
  const chosen = learning.commitments.find(item => item.courseId === courseId && item.lessonId === moduleId)
  const ranked = rankClassroomIdeas({ courseId, activeCourseIds: [courseId], preferences })
  // Cada módulo propone una idea distinta de las que ya elegiste en otros módulos del curso.
  const usedElsewhere = new Set(learning.commitments.filter(item => item.courseId === courseId && item.lessonId !== moduleId).map(item => item.ideaId))
  const fresh = ranked.filter(item => !usedElsewhere.has(item.id))
  const ideas = fresh.length ? fresh : ranked
  const idea = (chosen && ranked.find(item => item.id === chosen.ideaId)) || ideas[index % ideas.length]
  const applied = appliedIdeas(learning, courseId).length
  if (!idea) return null
  const { level, area } = ideaAudience(idea, preferences)

  const download = async () => {
    setBusy(true)
    try { await downloadIdeaPdf(idea, preferences) } finally { setBusy(false) }
  }


  return (
    <section className="rd-apply rd-modidea" aria-labelledby="modidea-title">
      <div className="rd-apply-copy">
        <div className="rd-apply-title">
          <span className="rd-step-tile tone-deep" aria-hidden="true"><Lightbulb size={22} /></span>
          <div>
            <span className="rd-modidea-kicker">Para tu aula</span>
            <h2 id="modidea-title">{idea.title}</h2>
          </div>
        </div>
        <p className="rd-apply-prompt">{idea.summary}</p>
        <div className="rd-apply-chips">
          <span className="dark">{level} · {area}</span>
          <span><Clock size={13} /> {idea.minutes} min</span>
          <span>{idea.grouping}</span>
          {idea.offline && <span><WifiOff size={13} /> Sin conexión</span>}
        </div>
        {chosen && <p className="rd-apply-committed" role="status"><CalendarClock size={18} /> Elegiste probarla. El {longDate(followUpAt(chosen))} te preguntamos en el Inicio cómo te fue.</p>}
        <div className="rd-apply-actions">
          {!chosen && <button className="rd-btn rd-btn-dark" type="button" onClick={() => commitToIdea({ idea, courseId, lessonId: moduleId })}><Check size={17} /> La voy a probar</button>}
          <button className="rd-btn rd-btn-soft-amber" type="button" onClick={download} disabled={busy}><Download size={17} /> {busy ? 'Generando…' : 'Ficha'}</button>
          {!chosen && ideas.length > 1 && <button className="rd-btn rd-btn-plain" type="button" onClick={() => setIndex(current => current + 1)}><Shuffle size={16} /> Ver otra idea</button>}
        </div>
        {!chosen && (
          <p className="rd-modidea-note">
            Si la probás, en 2 días te preguntamos cómo te fue.{' '}
            {applied >= REQUIRED_APPLIED_IDEAS
              ? `Ya contaste ${applied} ideas: ese requisito del curso está cumplido.`
              : `Para aprobar el curso alcanza con probar ${REQUIRED_APPLIED_IDEAS} de las ${moduleCount} ideas${applied ? ` (llevás ${applied})` : ''}.`}
          </p>
        )}
      </div>
      <div className="rd-apply-sheet" aria-hidden="true">
        <div className="back" />
        <div className="front"><span>Ficha de actividad</span><strong>{idea.title}</strong><i /><i /><div><b className="tone-green" /><b className="tone-rose" /><b className="tone-blue" /></div></div>
      </div>
    </section>
  )
}

/* Cierre del módulo: resultado del repaso, idea para el aula y cómo seguir. */
export function ModuleClose({ courseId, moduleId, moduleNumber, moduleCount, score, nextLabel, onNext, onPractice }) {
  return (
    <div className="rd-modclose">
      <section className="rd-modclose-hero" aria-labelledby="modclose-title">
        <div className="rd-modclose-copy">
          <span className="rd-lesson-eyebrow">Módulo {moduleNumber} · completado</span>
          <h1 id="modclose-title">¡Terminaste el módulo {moduleNumber}!</h1>
          <p>
            {score?.total ? <>Respondiste el repaso: <strong>{score.correct} de {score.total} correctas</strong>.</> : 'Ya hiciste el repaso de este módulo.'}
          </p>
          <button className="rd-btn rd-btn-white rd-btn-sm" type="button" onClick={onPractice}><RotateCcw size={16} /> Volver a practicar el repaso</button>
        </div>
        <Mascot state="celebra" once className="rd-modclose-bot" />
      </section>

      <ModuleIdea key={moduleId} courseId={courseId} moduleId={moduleId} moduleIndex={moduleNumber - 1} moduleCount={moduleCount} />

      <div className="rd-modclose-next">
        <button className="rd-btn rd-btn-primary rd-btn-lg" type="button" onClick={onNext}>{nextLabel} <ArrowRight size={18} /></button>
      </div>
    </div>
  )
}
