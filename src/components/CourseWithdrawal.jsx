import { useEffect, useId, useRef } from 'react'
import { unenrollCourse, useCourseEnrollment, useCourseFinished } from '../data/courseState'

function CourseWithdrawal({ course, onWithdraw }) {
  const enrolled = useCourseEnrollment(course)
  const finished = useCourseFinished(course)
  const dialog = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!enrolled || finished) dialog.current?.close()
  }, [enrolled, finished])

  const confirmWithdrawal = () => {
    dialog.current.close()
    if (unenrollCourse(course)) onWithdraw?.()
  }

  if (!enrolled || finished) return null

  return (
    <div className="course-withdrawal">
        <button className="withdrawal-link" type="button" onClick={(event) => { event.stopPropagation(); dialog.current.showModal() }}>
          Darme de baja
        </button>
      <dialog className="withdrawal-dialog" ref={dialog} aria-labelledby={titleId} aria-describedby={descriptionId}>
        <h2 id={titleId}>¿Querés darte de baja de este curso?</h2>
        <p id={descriptionId}>
          El curso dejará de aparecer en Mis cursos y en Continuar aprendiendo. Conservaremos tu avance por si decidís volver a inscribirte.
        </p>
        <div className="withdrawal-dialog-actions">
          <button className="button button-secondary" type="button" autoFocus onClick={() => dialog.current.close()}>
            Seguir inscripto
          </button>
          <button className="button button-danger" type="button" onClick={confirmWithdrawal}>
            Darme de baja
          </button>
        </div>
      </dialog>
    </div>
  )
}

export default CourseWithdrawal
