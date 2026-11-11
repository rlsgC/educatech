import { ArrowRight, CheckCircle2, CircleAlert, RotateCcw } from 'lucide-react'
import { useState } from 'react'

function ReviewActivity({ activity, completed, isLastModule, onComplete, onContinue, onBackToContents }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [checked, setChecked] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [finished, setFinished] = useState(false)
  const question = activity.questions[questionIndex]
  const isCorrect = checked && selectedOption === question.correctOption

  const checkAnswer = () => {
    if (selectedOption === null || checked) return
    const nextCorrectAnswers = correctAnswers + (selectedOption === question.correctOption ? 1 : 0)
    setCorrectAnswers(nextCorrectAnswers)
    setChecked(true)
    if (questionIndex === activity.questions.length - 1) {
      setFinished(true)
      onComplete()
    }
  }

  const nextQuestion = () => {
    setQuestionIndex((current) => current + 1)
    setSelectedOption(null)
    setChecked(false)
  }

  const restart = () => {
    setQuestionIndex(0)
    setSelectedOption(null)
    setChecked(false)
    setCorrectAnswers(0)
    setFinished(false)
  }

  if (finished) {
    const feedback = correctAnswers === 3
      ? '¡Muy bien! Consolidaste los principales temas del módulo.'
      : correctAnswers === 2
        ? '¡Buen trabajo! Podés volver a practicar para reforzar el tema pendiente.'
        : 'Te recomendamos repasar los contenidos y volver a intentarlo a tu ritmo.'
    return (
      <article className="lesson-panel review-panel" aria-live="polite">
        <span className="pill"><CheckCircle2 size={16} /> Actividad completada</span>
        <div className="review-result">
          <CheckCircle2 size={42} aria-hidden="true" />
          <h2>Respondiste correctamente {correctAnswers} de 3 preguntas</h2>
          <p>{feedback}</p>
          <p className="review-note">Esta actividad es formativa: no tiene límite de tiempo ni nota mínima, permite intentos ilimitados y no reemplaza la evaluación final ni emite certificados.</p>
        </div>
        <div className="review-finish-actions">
          <button className="button button-secondary" type="button" onClick={restart}>
            <RotateCcw size={18} /> Volver a practicar
          </button>
          <button className="button" type="button" onClick={isLastModule ? onBackToContents : onContinue}>
            {isLastModule ? 'Volver al contenido del curso' : 'Continuar al módulo siguiente'}
            <ArrowRight size={18} />
          </button>
        </div>
        {completed && <span className="review-saved"><CheckCircle2 size={16} /> Progreso guardado</span>}
      </article>
    )
  }

  return (
    <article className="lesson-panel review-panel">
      <span className="pill">Actividad de repaso</span>
      <div className="review-heading">
        <h2>Poné en práctica lo aprendido</h2>
        <p>3 preguntas para repasar este módulo. Podés volver a intentarlo.</p>
      </div>
      <div className="review-progress" aria-label={`Pregunta ${questionIndex + 1} de 3`}>
        <strong>Pregunta {questionIndex + 1} de 3</strong>
        <div className="review-progress-track" aria-hidden="true">
          <span style={{ width: `${((questionIndex + 1) / 3) * 100}%` }} />
        </div>
      </div>
      <fieldset className="review-question">
        <legend>{question.prompt}</legend>
        <div className="review-options">
          {question.options.map((option, index) => (
            <label className={`review-option ${selectedOption === index ? 'selected' : ''}`} key={option}>
              <input
                type="radio"
                name={question.id}
                value={index}
                checked={selectedOption === index}
                disabled={checked}
                onChange={() => setSelectedOption(index)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {checked && (
        <div className={`review-feedback ${isCorrect ? 'correct' : 'incorrect'}`} role="status">
          {isCorrect ? <CheckCircle2 aria-hidden="true" /> : <CircleAlert aria-hidden="true" />}
          <div>
            <strong>{isCorrect ? 'Respuesta correcta' : 'Respuesta incorrecta'}</strong>
            <p>{question.feedback}</p>
          </div>
        </div>
      )}
      <div className="review-question-actions">
        <button className="button" type="button" disabled={selectedOption === null || checked} onClick={checkAnswer}>
          Comprobar respuesta
        </button>
        {checked && questionIndex < 2 && (
          <button className="button" type="button" onClick={nextQuestion}>
            Siguiente pregunta <ArrowRight size={18} />
          </button>
        )}
      </div>
    </article>
  )
}

export default ReviewActivity
