import { Brain, Check, ChevronDown, FileText, Lightbulb, Video } from 'lucide-react'
import { useId, useState } from 'react'
import { cleanLessonTitle, moduleName } from '../utils/session'

const TONES = ['violet', 'blue', 'teal', 'rose']

const countLabel = module => {
  const lessons = module.lessons.filter(lesson => lesson.type !== 'review').length
  const hasReview = module.lessons.some(lesson => lesson.type === 'review')
  if (module.lessons.length === 0) return 'Próximamente'
  const base = lessons === 0 ? '' : `${lessons} ${lessons === 1 ? 'lección' : 'lecciones'}`
  return hasReview ? (base ? `${base} + repaso` : 'Repaso') : base
}

// Contenido del curso: todos los módulos con su cantidad de lecciones y avance.
// El módulo actual se abre solo; los demás se abren con la flecha.
function ModuleAccordion({ modules, selectedLessonId, onSelectLesson, completedLessons = [], ideaModules = [] }) {
  const baseId = useId()
  const [toggled, setToggled] = useState({})
  const currentTitle = modules.find(module => module.lessons.some(lesson => lesson.id === selectedLessonId))?.title

  return (
    <div className="rd-temario">
      {modules.map((module, moduleIndex) => {
        const isCurrent = module.title === currentTitle
        const isOpen = toggled[module.title] ?? isCurrent
        const total = module.lessons.length
        const done = module.lessons.filter(lesson => completedLessons.includes(lesson.id)).length
        const finished = total > 0 && done === total
        const review = module.lessons.find(lesson => lesson.type === 'review')
        const panelId = `${baseId}-m${moduleIndex}`
        const name = moduleName(module.title)
        let lessonNumber = 0

        return (
          <section className={`rd-temario-module ${isOpen ? 'is-open' : ''} ${isCurrent ? 'is-current' : ''}`} key={module.title}>
            <button
              className="rd-temario-head"
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setToggled(current => ({ ...current, [module.title]: !isOpen }))}
            >
              <span className={`rd-temario-num ${finished ? 'is-done' : ''}`} aria-hidden="true">{finished ? <Check size={16} strokeWidth={3} /> : moduleIndex + 1}</span>
              <span className="rd-temario-copy">
                <strong><span className="sr-only">Módulo {moduleIndex + 1}: </span>{name}</strong>
                <small>
                  {countLabel(module)}
                  {review && ideaModules.includes(review.id) && <span className="rd-temario-ideatag"><Lightbulb size={12} aria-hidden="true" /> Idea elegida</span>}
                </small>
                {total > 0 && (
                  <span className="rd-temario-bar">
                    <span aria-hidden="true"><span style={{ width: `${Math.round((done / total) * 100)}%` }} /></span>
                    <small><span className="sr-only">Hiciste </span>{done}/{total}</small>
                  </span>
                )}
              </span>
              <ChevronDown className="rd-temario-chev" size={18} aria-hidden="true" />
            </button>

            {isOpen && (
              <div className="rd-temario-items" id={panelId}>
                {total === 0 && <span className="rd-temario-soon">Contenido disponible próximamente</span>}
                {module.lessons.map(lesson => {
                  const isReview = lesson.type === 'review'
                  if (!isReview) lessonNumber += 1
                  const completed = completedLessons.includes(lesson.id)
                  const now = lesson.id === selectedLessonId
                  const tone = isReview ? 'amber' : TONES[(lessonNumber - 1) % TONES.length]
                  const Icon = isReview ? Brain : lesson.video ? Video : FileText
                  const title = isReview ? `Repaso del módulo · ${lesson.questions?.length ?? 0} preguntas` : cleanLessonTitle(lesson.title)
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      className={`rd-temario-item ${now ? 'is-now' : ''} ${completed ? 'is-done' : ''}`}
                      aria-current={now ? 'step' : undefined}
                      onClick={() => onSelectLesson(lesson)}
                    >
                      {completed
                        ? <span className="rd-temario-check" aria-hidden="true"><Check size={15} strokeWidth={3} /></span>
                        : <span className={`rd-step-tile tone-${tone} ${now ? 'is-solid' : ''}`} aria-hidden="true"><Icon size={15} /></span>}
                      <span className="rd-temario-title">{title}{completed && <span className="sr-only"> (completada)</span>}</span>
                      {now && <span className="rd-temario-now">Ahora</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

export default ModuleAccordion
