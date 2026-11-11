import { ArrowRight, BookOpen, Clock, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import CourseWithdrawal from './CourseWithdrawal'
import { getCourseProgress, useCourseEnrollment } from '../data/courseState'
import CourseCover from './CourseCover'
import { categoryLabel, courseTone } from '../utils/learning'
import { courseCurricula } from '../data/courses'
import { coursePuntaje } from '../data/puntaje'

const lessonCount = course => (courseCurricula[course.id] ?? []).flatMap(module => module.lessons).filter(lesson => lesson.type !== 'review').length

function CourseCard({ course, showProgress = false, allowWithdrawal = false, onWithdraw, badge }) {
  const enrolled = useCourseEnrollment(course)
  const target = enrolled ? `/cursos/${course.id}/aprender` : `/catalogo/${course.id}`
  const progress = getCourseProgress(course)
  const puntaje = coursePuntaje(course)
  const lessons = lessonCount(course)

  return (
    <article className="rd-card rd-catalog-card">
      <CourseCover course={course} label={badge} size="lg">
        <span className="rd-cover-hours"><Clock size={14} /> {course.teachingHours || course.duration}</span>
      </CourseCover>
      <div className="rd-catalog-card-body">
        <span className={`rd-category tone-text-${courseTone(course)}`}>{categoryLabel(course.category)}</span>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        {showProgress && (
          <div className="rd-catalog-progress">
            <span className="rd-muted"><BookOpen size={15} /> {progress.completedModules} de {progress.totalModules} módulos completados</span>
            <div className="rd-progress"><span><span style={{ width: `${progress.percentage}%` }} /></span><strong>{progress.percentage}%</strong></div>
          </div>
        )}
        {lessons > 0 && <span className="rd-card-lessons"><ListChecks size={16} /> {lessons} lecciones · {course.modality}</span>}
        <div className="rd-catalog-card-foot">
          <span className={`rd-puntaje tone-${puntaje.tone}`} title={puntaje.help}>{puntaje.estado === 'con' ? `Con puntaje · ${puntaje.resolucion}` : puntaje.short}</span>
          <Link className="rd-link" to={target}>{enrolled ? 'Continuar' : 'Ver curso'} <ArrowRight size={16} /></Link>
        </div>
        {allowWithdrawal && <CourseWithdrawal course={course} onWithdraw={onWithdraw} />}
      </div>
    </article>
  )
}

export default CourseCard
