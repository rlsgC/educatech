import { ArrowRight, Check, Brain, Play, RotateCcw, Video } from 'lucide-react'
import { useState } from 'react'
import Mascot from './Mascot'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

// Preguntas cortas con devolución inmediata. Recordar (en vez de releer) es una de las
// formas más efectivas de que lo aprendido quede. `sourceOf` indica de qué lección viene
// cada pregunta y permite volver a verla cuando la respuesta no es correcta.
function LessonQuiz({ questions, done, onDone, title = 'Recordá', subtitle = 'Responder ayuda a que no se te olvide', compact = false, sourceOf, showResult = true }) {
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState(null)
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [retake, setRetake] = useState(false)
  const [missed, setMissed] = useState([])

  const total = questions.length
  const question = questions[index]
  const isCorrect = checked && choice === question?.correctOption
  const source = question ? sourceOf?.(question) : null

  const check = () => {
    if (choice === null) return
    setChecked(true)
    if (choice === question.correctOption) setCorrectCount(count => count + 1)
    else setMissed(current => [...current, question.id])
  }
  const next = () => {
    if (index + 1 < total) {
      setIndex(index + 1)
      setChoice(null)
      setChecked(false)
      return
    }
    setFinished(true)
    onDone?.({ correct: correctCount, total, missed })
  }
  const restart = () => {
    setIndex(0)
    setChoice(null)
    setChecked(false)
    setCorrectCount(0)
    setMissed([])
    setFinished(false)
    setRetake(true)
  }

  if (finished && !showResult) return null
  if (finished || (done && !retake)) {
    return (
      <div className="rd-quiz-done" role="status">
        <Mascot state="celebra" once className="rd-quiz-done-bot" />
        <div>
          <strong>{finished ? `¡Listo! Acertaste ${correctCount} de ${total}.` : 'Ya respondiste estas preguntas.'}</strong>
          <p>{finished && correctCount < total ? 'Leé de nuevo las explicaciones de las que fallaste: así se fija mejor.' : 'Volvé a responderlas en unos días para recordarlas mejor.'}</p>
        </div>
        <button className="rd-btn rd-btn-soft" type="button" onClick={restart}><RotateCcw size={16} /> Responder de nuevo</button>
      </div>
    )
  }

  return (
    <div className={`rd-quiz ${compact ? 'is-compact' : ''}`}>
      <div className="rd-quiz-head">
        <div className="rd-quiz-title">
          <span className="rd-step-tile tone-blue is-solid" aria-hidden="true"><Brain size={22} /></span>
          <div><h2>{title}</h2>{subtitle && <span>{subtitle}</span>}</div>
        </div>
        <div className="rd-quiz-progress">
          <small>Pregunta {index + 1} de {total}</small>
          <div className="rd-quiz-dots" aria-hidden="true">
            {questions.map((item, position) => <span key={item.id} className={position < index || (position === index && checked) ? 'done' : position === index ? 'now' : ''} />)}
          </div>
        </div>
      </div>
      {source?.label && <span className="rd-quiz-source"><Video size={15} aria-hidden="true" /> {source.label}</span>}
      <p className="rd-quiz-question" id={`q-${question.id}`}>{question.prompt}</p>
      <div className="rd-quiz-options" role="radiogroup" aria-labelledby={`q-${question.id}`}>
        {question.options.map((option, position) => {
          const state = checked
            ? position === question.correctOption ? 'is-correct' : position === choice ? 'is-wrong' : 'is-dim'
            : position === choice ? 'is-selected' : ''
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={choice === position}
              className={`rd-quiz-option ${state}`}
              onClick={() => !checked && setChoice(position)}
              disabled={checked}
            >
              <span className="rd-quiz-letter" aria-hidden="true">{checked && position === question.correctOption ? <Check size={17} strokeWidth={3} /> : LETTERS[position]}</span>
              <span>{option}</span>
            </button>
          )
        })}
      </div>
      {checked && (
        <div className={`rd-quiz-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`} role="status">
          {isCorrect && <Mascot key={question.id} state="celebra" once decorative className="rd-quiz-bot" />}
          <p><strong>{isCorrect ? '¡Bien!' : 'Casi.'}</strong> {question.feedback}{!isCorrect && source?.lessonTitle ? ` Lo viste en “${source.lessonTitle}”.` : ''}</p>
          {!isCorrect && source?.onRewatch && <button className="rd-btn rd-btn-white rd-btn-sm" type="button" onClick={source.onRewatch}><Play size={14} /> {source.rewatchLabel}</button>}
        </div>
      )}
      <div className="rd-quiz-actions">
        {!checked
          ? <button className="rd-btn rd-btn-blue" type="button" onClick={check} disabled={choice === null}>Comprobar respuesta</button>
          : <button className="rd-btn rd-btn-blue" type="button" onClick={next}>{index + 1 < total ? 'Siguiente pregunta' : 'Terminar'} <ArrowRight size={17} /></button>}
      </div>
    </div>
  )
}

export default LessonQuiz
