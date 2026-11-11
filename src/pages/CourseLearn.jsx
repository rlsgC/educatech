import { ArrowLeft, ArrowRight, Award, BookOpen, Check, CheckCircle2, Clock, Download, FileText, Lightbulb, List, Lock, Video, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CourseContent from '../components/CourseContent'
import FinalAssessment from '../components/FinalAssessment'
import { ModuleClose } from '../components/LessonApply'
import LessonQuiz from '../components/LessonQuiz'
import Mascot from '../components/Mascot'
import ModuleAccordion from '../components/ModuleAccordion'
import { RobotBubble } from '../components/RobotPortal'
import { RobotMark } from '../components/BrandLogo'
import { earnSampleCertificate } from '../data/certificateState'
import { courseCurricula, courses } from '../data/courses'
import { markCourseVisited, readCourseProgress, readFinalAssessment, saveCourseProgress, saveFinalAssessment } from '../data/courseState'
import { recordActivity } from '../data/dashboardState'
import { finalAssessments } from '../data/finalAssessments'
import { REQUIRED_APPLIED_IDEAS, appliedIdeas, lessonSteps, markLessonStep, pendingCommitments, saveReviewResult, useLearningState } from '../data/learningState'
import { coursePuntaje } from '../data/puntaje'
import { cleanLessonTitle, estimateMinutes, lessonOutcome, moduleName, withAccents } from '../utils/session'

const courseDownloads = {
  'herramientas-digitales': { label: 'Guía de selección de herramientas', href: 'downloads/guia-herramientas-digitales.md' },
  'ia-educacion': { label: 'Guía de actividades con IA', href: 'downloads/guia-ia-educacion.md' },
}

// Repaso del módulo: de qué lección viene cada pregunta. Si el área de contenidos carga
// `question.lessonId`, se usa ese dato; si hay tantas preguntas como lecciones, se asume
// el mismo orden; si no, la pregunta se presenta como del módulo.
function questionSource(module, question, position) {
  const lessons = module?.lessons.filter(item => item.type !== 'review') ?? []
  if (question.lessonId) return lessons.find(item => item.id === question.lessonId) ?? null
  const total = module?.lessons.find(item => item.type === 'review')?.questions?.length ?? 0
  return total === lessons.length ? lessons[position] ?? null : null
}

function CourseLearn() {
  const { courseId } = useParams()
  const mainCourse = courses.find(course => course.id === courseId)
  if (!mainCourse) return <div className="rd-lesson-missing"><p>Curso no encontrado.</p><Link to="/mis-cursos">Volver a mis cursos</Link></div>
  const modules = courseCurricula[mainCourse.id] ?? []
  if (modules.length === 0) return <div className="rd-lesson-missing"><p>El contenido de este curso estará disponible próximamente.</p><Link to={`/cursos/${mainCourse.id}`}>Volver al curso</Link></div>
  return <CourseLessons key={mainCourse.id} mainCourse={mainCourse} modules={modules} />
}

function CourseLessons({ mainCourse, modules }) {
  const lessons = useMemo(() => modules.flatMap(module => module.lessons), [modules])
  const [initialProgress] = useState(() => readCourseProgress(mainCourse.id, lessons))
  const [selectedLesson, setSelectedLesson] = useState(initialProgress.lesson)
  const [completedLessons, setCompletedLessons] = useState(initialProgress.completed)
  const [outlineOpen, setOutlineOpen] = useState(false)
  const [practicing, setPracticing] = useState(false)
  const [reviewScore, setReviewScore] = useState(null)
  const [finalResult, setFinalResult] = useState(() => readFinalAssessment(mainCourse.id))
  // Al volver a un curso terminado, se abre directo en la evaluación final.
  const [showFinal, setShowFinal] = useState(() => Boolean(finalAssessments[mainCourse.id]) && initialProgress.completed.length === lessons.length)
  const topRef = useRef(null)
  const learning = useLearningState()
  const assessment = finalAssessments[mainCourse.id]
  const download = courseDownloads[mainCourse.id]

  useEffect(() => { markCourseVisited(mainCourse.id) }, [mainCourse.id])
  useEffect(() => {
    saveCourseProgress(mainCourse.id, completedLessons, selectedLesson.id)
  }, [mainCourse.id, completedLessons, selectedLesson.id])

  const selectedIndex = lessons.findIndex(lesson => lesson.id === selectedLesson.id)
  const moduleIndex = modules.findIndex(module => module.lessons.some(item => item.id === selectedLesson.id))
  const currentModule = modules[moduleIndex]
  const progress = Math.round((completedLessons.length / lessons.length) * 100)
  const contentComplete = completedLessons.length === lessons.length
  const isCompleted = completedLessons.includes(selectedLesson.id)
  const isReview = selectedLesson.type === 'review'
  const watched = lessonSteps(learning, mainCourse.id, selectedLesson.id).watched || isCompleted
  const reviewQuestions = isReview ? selectedLesson.questions ?? [] : []
  const moduleClosed = isReview && isCompleted && !practicing
  const nextModule = modules[moduleIndex + 1]
  const appliedList = appliedIdeas(learning, mainCourse.id)
  const applied = appliedList.length
  const appliedTitles = appliedList.map(item => item.title)
  const waiting = pendingCommitments(learning).filter(item => item.courseId === mainCourse.id).length
  const ideaModules = learning.commitments.filter(item => item.courseId === mainCourse.id).map(item => item.lessonId)
  const lessonCount = lessons.filter(lesson => lesson.type !== 'review').length
  const reviewCount = lessons.length - lessonCount
  const assessmentReady = contentComplete && applied >= REQUIRED_APPLIED_IDEAS
  const puntaje = coursePuntaje(mainCourse)

  const goTo = lesson => {
    if (!lesson) return
    setSelectedLesson(lesson)
    setShowFinal(false)
    setOutlineOpen(false)
    setPracticing(false)
    setReviewScore(null)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const completeLesson = () => setCompletedLessons(current => {
    if (current.includes(selectedLesson.id)) return current
    const next = [...current, selectedLesson.id]
    recordActivity({ id: `lesson:${mainCourse.id}:${selectedLesson.id}`, type: 'lesson', title: 'Completaste una lección', detail: selectedLesson.title, courseId: mainCourse.id })
    if (currentModule?.lessons.every(lesson => next.includes(lesson.id))) {
      recordActivity({ id: `module:${mainCourse.id}:${currentModule.title}`, type: 'module', title: 'Terminaste un módulo', detail: `${currentModule.title} · ${mainCourse.title}`, courseId: mainCourse.id })
    }
    return next
  })
  const finishReview = result => {
    saveReviewResult({ courseId: mainCourse.id, questionIds: reviewQuestions.map(item => item.id), missedIds: result.missed })
    setReviewScore(result)
    setPracticing(false)
    completeLesson()
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const completeAndContinue = () => {
    markLessonStep(mainCourse.id, selectedLesson.id, 'watched')
    completeLesson()
    if (lessons[selectedIndex + 1]) goTo(lessons[selectedIndex + 1])
  }
  const openFinal = () => {
    setShowFinal(true)
    setOutlineOpen(false)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const handleFinalResult = result => {
    saveFinalAssessment(mainCourse.id, result.score, result.passed)
    setFinalResult(readFinalAssessment(mainCourse.id))
    if (result.passed) {
      earnSampleCertificate(mainCourse)
      recordActivity({ id: `certificate:${mainCourse.id}`, type: 'certificate', title: 'Obtuviste un certificado de muestra', detail: mainCourse.title, courseId: mainCourse.id })
    }
  }

  const bubble = isCompleted
    ? '¡Lección completada! Cuando quieras, seguimos con la próxima.'
    : isReview ? 'Repasemos el módulo: sin apuro y sin nota.'
      : selectedLesson.video
        ? '¡Arrancamos! Un video corto y una idea clave para llevarte.'
        : '¡Arrancamos! Una lectura breve y una idea clave para llevarte.'


  const outline = (
    <>
      <div className="rd-lesson-outline-head">
        <div>
          <h2>Contenido del curso</h2>
          <small>{modules.length} {modules.length === 1 ? 'módulo' : 'módulos'} · {lessonCount} lecciones · {reviewCount} {reviewCount === 1 ? 'repaso' : 'repasos'}</small>
        </div>
        <span><CheckCircle2 size={15} /> {completedLessons.length} de {lessons.length}</span>
        <button className="rd-lesson-outline-close" type="button" onClick={() => setOutlineOpen(false)} aria-label="Cerrar temario"><X size={20} /></button>
      </div>
      <ModuleAccordion modules={modules} selectedLessonId={showFinal ? null : selectedLesson.id} onSelectLesson={goTo} completedLessons={completedLessons} ideaModules={ideaModules} />
      {assessment && (
        <div className="rd-temario-final">
          <button className={`rd-temario-final-btn ${finalResult.passed ? 'is-done' : assessmentReady ? 'is-ready' : 'is-locked'} ${showFinal ? 'is-now' : ''}`} type="button" onClick={openFinal} aria-current={showFinal ? 'step' : undefined}>
            {finalResult.passed
              ? <span className="rd-temario-check" aria-hidden="true"><Check size={16} strokeWidth={3} /></span>
              : <span className={`rd-step-tile tone-amber ${assessmentReady ? 'is-solid' : ''}`} aria-hidden="true">{assessmentReady ? <Award size={17} /> : <Lock size={16} />}</span>}
            <span>
              <strong>Evaluación final</strong>
              <small>{finalResult.passed ? `Aprobada${finalResult.bestScore ? ` · ${finalResult.bestScore} de ${assessment.questions.length}` : ''}` : `${assessment.questions.length} preguntas · aprobás con ${assessment.requiredCorrect}`}</small>
            </span>
            {showFinal ? <em>Ahora</em> : finalResult.passed ? <em className="ok">Listo</em> : !assessmentReady ? <span className="sr-only">(todavía bloqueada)</span> : null}
          </button>
        </div>
      )}
    </>
  )

  return (
    <div className="rd-lesson" ref={topRef}>
      <header className="rd-lesson-bar">
        <div className="rd-lesson-bar-left">
          <Link to="/" aria-label="Ir al inicio" className="rd-lesson-mark"><RobotMark size={38} /></Link>
          <Link className="rd-lesson-back" to={`/cursos/${mainCourse.id}`}><ArrowLeft size={18} /> <span>Volver al curso</span></Link>
        </div>
        <div className="rd-lesson-bar-right">
          <div className="rd-lesson-bar-progress">
            <strong>{withAccents(mainCourse.title)}</strong>
            <span aria-label={`Progreso del curso ${progress}%`}><span style={{ width: `${progress}%` }} /></span>
          </div>
          <span className="rd-lesson-count">{showFinal ? 'Final' : `${selectedIndex + 1} / ${lessons.length}`}</span>
          <button className="rd-lesson-outline-btn" type="button" onClick={() => setOutlineOpen(true)} aria-label="Ver temario"><List size={20} /></button>
        </div>
      </header>

      <div className="rd-lesson-wrap">
        {!moduleClosed && !showFinal && <section className={`rd-lesson-hero ${isReview ? 'is-review' : ''}`} aria-labelledby="lesson-title">
          <div className="rd-lesson-hero-copy">
            <span className="rd-lesson-eyebrow">Módulo {moduleIndex + 1} · {isReview ? 'Repaso' : `Lección ${selectedIndex + 1} de ${lessons.length}`}</span>
            <h1 id="lesson-title">{isReview ? `Repaso del módulo ${moduleIndex + 1}` : cleanLessonTitle(selectedLesson.title)}</h1>
            <div className="rd-lesson-chips">
              <span className="key"><Clock size={14} /> {isReview ? Math.max(2, reviewQuestions.length) : estimateMinutes(selectedLesson)} minutos</span>
              <span>{isReview ? `${reviewQuestions.length} preguntas del módulo` : selectedLesson.video ? 'Video + idea clave' : 'Lectura + idea clave'}</span>
              <span>{moduleName(currentModule?.title)}</span>
              {isCompleted && <span className="ok"><Check size={14} /> Completada</span>}
            </div>
            {!isReview && lessonOutcome(selectedLesson) && <p><strong>Al terminar vas a poder</strong> {lessonOutcome(selectedLesson)}</p>}
          </div>
          <div className="rd-lesson-hero-robot">
            <RobotBubble>{bubble}</RobotBubble>
            <Mascot state={isCompleted ? 'celebra' : isReview ? 'piensa' : 'estudia'} once={isCompleted} className="rd-lesson-hero-bot" />
          </div>
        </section>}


        <div className="rd-lesson-grid">
          <div className="rd-lesson-main">
            {showFinal && assessment ? (
              <FinalAssessment
                assessment={assessment}
                course={mainCourse}
                initialResult={finalResult}
                ready={assessmentReady}
                contentDone={contentComplete}
                contentDetail={contentComplete ? `${lessonCount} lecciones y ${reviewCount} repasos` : `Llevás ${completedLessons.length} de ${lessons.length} entre lecciones y repasos`}
                ideasDone={applied >= REQUIRED_APPLIED_IDEAS}
                ideasDetail={applied >= REQUIRED_APPLIED_IDEAS
                  ? `Contaste cómo te fue con ${appliedTitles.slice(0, 2).map(title => `“${title}”`).join(' y ')}${applied > 2 ? ` y ${applied - 2} más` : ''}`
                  : `Llevás ${applied} de ${REQUIRED_APPLIED_IDEAS}. Al cerrar cada módulo te proponemos una${waiting ? `; tenés ${waiting} elegida${waiting === 1 ? '' : 's'} y te preguntamos en el Inicio cómo te fue` : ''}.`}
                contentCount={lessons.length}
                applied={applied}
                onResult={handleFinalResult}
              />
            ) : moduleClosed ? (
              <ModuleClose
                courseId={mainCourse.id}
                moduleId={selectedLesson.id}
                moduleNumber={moduleIndex + 1}
                moduleCount={modules.length}
                score={reviewScore}
                nextLabel={nextModule ? `Seguir con el módulo ${moduleIndex + 2}` : 'Ir a la evaluación final'}
                onNext={() => (nextModule ? goTo(nextModule.lessons[0]) : openFinal())}
                onPractice={() => setPracticing(true)}
              />
            ) : isReview ? (
              <section className="rd-card rd-module-review" aria-label="Repaso del módulo">
                {reviewQuestions.length > 0 ? (
                  <LessonQuiz
                    key={`${selectedLesson.id}-${practicing}`}
                    questions={reviewQuestions}
                    title="Repaso del módulo"
                    subtitle="Si te equivocás, te mostramos de qué lección era para volver a verla."
                    showResult={false}
                    onDone={finishReview}
                    sourceOf={question => {
                      const lesson = questionSource(currentModule, question, reviewQuestions.indexOf(question))
                      return lesson
                        ? { label: `De la lección: ${cleanLessonTitle(lesson.title)}`, lessonTitle: cleanLessonTitle(lesson.title), rewatchLabel: 'Volver a ver la lección', onRewatch: () => goTo(lesson) }
                        : { label: `Del módulo ${moduleIndex + 1}: ${moduleName(currentModule?.title)}`, rewatchLabel: 'Volver al inicio del módulo', onRewatch: () => goTo(currentModule?.lessons[0]) }
                    }}
                  />
                ) : (
                  <div className="rd-module-review-empty">
                    <p>Este módulo todavía no tiene preguntas de repaso.</p>
                    <button className="rd-btn rd-btn-primary" type="button" onClick={() => finishReview({ correct: 0, total: 0, missed: [] })}>Cerrar el módulo</button>
                  </div>
                )}
                <p className="rd-module-review-note">Las que te cuesten te las volvemos a mostrar unos días después en el Inicio, en un repaso de 2 minutos.</p>
              </section>
            ) : (
              <>
                <section className="rd-watch" aria-label="Lección">
                  {selectedLesson.video ? (
                    <div className="rd-watch-video">
                      <video
                        src={selectedLesson.video.src}
                        poster={selectedLesson.video.poster}
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={selectedLesson.video.title}
                        onEnded={() => markLessonStep(mainCourse.id, selectedLesson.id, 'watched')}
                      >
                        Tu navegador no admite la reproducción de video.
                      </video>
                      <div className="rd-watch-meta">
                        <span><Video size={16} /> {selectedLesson.video.title}{selectedLesson.video.duration ? ` · ${selectedLesson.video.duration}` : ''}</span>
                        {watched && <span className="rd-chip-ok"><Check size={14} /> Visto</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="rd-watch-read">
                      <span className="rd-step-tile tone-violet is-solid" aria-hidden="true"><BookOpen size={22} /></span>
                      <div><strong>Esta lección es de lectura</strong><span>Leé la idea clave y el contenido completo.</span></div>
                      {watched && <span className="rd-chip-ok"><Check size={14} /> Leída</span>}
                    </div>
                  )}
                  <div className="rd-keyidea">
                    <span className="rd-step-tile tone-amber is-solid" aria-hidden="true"><Lightbulb size={22} /></span>
                    <div><strong>La idea clave</strong><p>{selectedLesson.reading?.keyIdea || selectedLesson.intro}</p></div>
                  </div>
                  <details className="rd-lesson-more">
                    <summary><FileText size={18} /> Leer la lección completa</summary>
                    <CourseContent lesson={selectedLesson} embedded />
                  </details>
                </section>


                <div className="rd-lesson-next">
                  <button className="rd-btn rd-btn-soft" type="button" onClick={() => goTo(lessons[selectedIndex - 1])} disabled={selectedIndex === 0}><ArrowLeft size={17} /> Anterior</button>
                  {isCompleted ? (
                    <button className="rd-btn rd-btn-primary rd-btn-lg" type="button" onClick={() => goTo(lessons[selectedIndex + 1])} disabled={selectedIndex === lessons.length - 1}>Siguiente lección <ArrowRight size={18} /></button>
                  ) : (
                    <button className="rd-btn rd-btn-primary rd-btn-lg" type="button" onClick={completeAndContinue}>
                      <CheckCircle2 size={18} /> Completar y seguir
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <aside className={`rd-lesson-side ${outlineOpen ? 'is-open' : ''}`} aria-label="Avance y temario">
            <section className="rd-card rd-lesson-outline">{outline}</section>
            {(selectedLesson.materials?.length > 0 || download) && (
              <section className="rd-card rd-lesson-files">
                <h2>Material</h2>
                {selectedLesson.materials?.map(material => typeof material === 'string'
                  ? <span key={material} className="rd-lesson-file"><span className="rd-step-tile tone-rose" aria-hidden="true"><FileText size={18} /></span>{material.replace('Presentacion: ', '').replace('Guia: ', '')}</span>
                  : <a key={material.href} className="rd-lesson-file" href={material.href} target="_blank" rel="noreferrer"><span className="rd-step-tile tone-rose" aria-hidden="true"><FileText size={18} /></span><span>{material.label}</span><Download size={17} /></a>)}
                {download && <a className="rd-lesson-file" href={download.href} download><span className="rd-step-tile tone-blue" aria-hidden="true"><Download size={18} /></span><span>{download.label}</span></a>}
              </section>
            )}
            <section className="rd-card rd-lesson-course">
              <h2>Este curso</h2>
              <span><Clock size={16} /> {withAccents(mainCourse.teachingHours || mainCourse.duration)}</span>
              <span className={`rd-puntaje tone-${puntaje.tone}`}>{puntaje.short}{puntaje.resolucion ? ` · ${puntaje.resolucion}` : ''}</span>
            </section>
          </aside>
          {outlineOpen && <button className="rd-lesson-scrim" type="button" aria-label="Cerrar temario" onClick={() => setOutlineOpen(false)} />}
        </div>

      </div>

      {!isReview && !isCompleted && !showFinal && (
        <div className="rd-lesson-mobile-action">
          <button className="rd-btn rd-btn-primary rd-btn-lg" type="button" onClick={completeAndContinue}><CheckCircle2 size={18} /> Completar y seguir</button>
        </div>
      )}
    </div>
  )
}

export default CourseLearn
