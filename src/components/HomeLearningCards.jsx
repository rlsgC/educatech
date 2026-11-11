import { RefreshCw, X } from 'lucide-react'
import { useState } from 'react'
import LessonQuiz from './LessonQuiz'
import { courseCurricula } from '../data/courses'
import { clearMissed, useLearningState } from '../data/learningState'
import { toDateKey } from '../utils/learning'

const weekday = new Intl.DateTimeFormat('es-AR', { weekday: 'long' })

// Repaso espaciado: solo las preguntas del repaso del módulo que costaron,
// a partir del día siguiente. Si acertaste todo, no aparece.
function findReview(missed) {
  const todayKey = toDateKey(new Date())
  const ready = missed.filter(item => toDateKey(new Date(item.date)) < todayKey)
  const questions = []
  for (const item of ready) {
    const question = (courseCurricula[item.courseId] ?? [])
      .flatMap(module => module.lessons)
      .find(lesson => lesson.type === 'review' && lesson.questions?.some(entry => entry.id === item.questionId))
      ?.questions.find(entry => entry.id === item.questionId)
    if (question && !questions.some(entry => entry.id === question.id)) questions.push(question)
    if (questions.length === 3) break
  }
  if (!questions.length) return null
  const first = ready.reduce((min, item) => (Date.parse(item.date) < Date.parse(min.date) ? item : min), ready[0])
  return { questions, when: weekday.format(new Date(first.date)) }
}

function ReviewDialog({ review, onClose }) {
  return (
    <div className="rd-backdrop" role="presentation" onClick={onClose}>
      <section className="rd-review-dialog" role="dialog" aria-modal="true" aria-label="Repaso de 2 minutos" onClick={event => event.stopPropagation()}>
        <button className="rd-icon-btn rd-review-close" type="button" onClick={onClose} aria-label="Cerrar repaso"><X size={18} /></button>
        <LessonQuiz
          questions={review.questions}
          title="Repaso de 2 minutos"
          subtitle={`Las que te costaron el ${review.when}`}
          onDone={() => clearMissed(review.questions.map(item => item.id))}
        />
      </section>
    </div>
  )
}

function HomeLearningCards() {
  const learning = useLearningState()
  const [openReview, setOpenReview] = useState(null)
  const review = findReview(learning.missed ?? [])
  if (!review && !openReview) return null

  return (
    <div className="rd-home-quick">
      {review && (
        <section className="rd-card rd-quick-review" aria-labelledby="review-title">
          <span className="rd-step-tile tone-green" aria-hidden="true"><RefreshCw size={21} /></span>
          <div>
            <h2 id="review-title">Repaso de 2 minutos</h2>
            <p>{review.questions.length === 1 ? 'La pregunta que te costó' : `Las ${review.questions.length} preguntas que te costaron`} en el repaso del {review.when}. Volver a intentarlo a los días es lo que más ayuda a no olvidar.</p>
          </div>
          <button className="rd-btn rd-btn-green" type="button" onClick={() => setOpenReview(review)}>Repasar</button>
        </section>
      )}
      {openReview && <ReviewDialog review={openReview} onClose={() => setOpenReview(null)} />}
    </div>
  )
}

export default HomeLearningCards
