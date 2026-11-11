import { ArrowLeft, ArrowRight, CheckCircle2, FileText, PlayCircle, Target } from 'lucide-react'
import { useState } from 'react'

// `embedded`: se usa dentro de la lección en 4 pasos; oculta título, video y botones
// (la lección nueva los muestra en sus propios pasos) y conserva todo el contenido de lectura.
function CourseContent({ lesson, onPrevious, onNext, onComplete, completed = false, hasPrevious = false, hasNext = true, embedded = false }) {
  const [videoError, setVideoError] = useState(false)
  return (
    <article className={embedded ? 'lesson-panel lesson-panel-embedded' : 'lesson-panel'}>
      {!embedded && <><span className="pill">Leccion seleccionada</span>
      <h2>{lesson.title}</h2></>}
      <p>{lesson.intro}</p>

      {lesson.example && <section className="lesson-block"><h3>Ejemplo aplicado al aula</h3><p>{lesson.example}</p></section>}
      {lesson.practice && <section className="lesson-block"><h3>Propuesta de práctica</h3><p>{lesson.practice}</p></section>}

      {lesson.reading?.keyIdea && lesson.reading.type !== 'board' && (
        <aside className="lesson-callout lesson-callout-key">
          <h3>Idea clave</h3>
          <p>{lesson.reading.keyIdea}</p>
        </aside>
      )}

      <section className="lesson-block">
        <h3><Target size={19} /> Objetivos de la leccion</h3>
        <ul>
          {(lesson.reading?.objectives || lesson.objectives).map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </section>

      {lesson.reading?.type === 'guide' && <>
        {lesson.reading.sections.map(section => (
          <section className="lesson-block" key={section.title}>
            <h3>{section.title}</h3>
            {section.text && <p>{section.text}</p>}
            {section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
          </section>
        ))}
        <aside className="lesson-callout lesson-callout-practice">
          <h3>Para llevar al aula</h3>
          <p>{lesson.reading.practice}</p>
          <small>Propuesta para realizar fuera de la plataforma.</small>
        </aside>
      </>}

      {lesson.reading && !lesson.reading.type && <>
        <section className="lesson-block">
          <h3>Antes de compartir el documento</h3>
          <p>{lesson.reading.preparation}</p>
        </section>

        <section className="lesson-block">
          <h3>Roles para organizar la colaboración</h3>
          <p>Podés distribuir tres roles, que se alternen durante la actividad:</p>
          <div className="lesson-table-wrap">
            <table className="lesson-table">
              <thead><tr><th>Rol</th><th>Responsabilidad</th></tr></thead>
              <tbody>
                {lesson.reading.roles.map(([role, responsibility]) => (
                  <tr key={role}><th scope="row">{role}</th><td>{responsibility}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lesson-block">
          <h3>Cuatro momentos de trabajo</h3>
          <p>{lesson.reading.stages}</p>
        </section>

        <aside className="lesson-callout">
          <h3>Ejemplo en Ciencias</h3>
          <p>{lesson.reading.scienceExample.intro}</p>
          <ul>{lesson.reading.scienceExample.questions.map(question => <li key={question}>{question}</li>)}</ul>
          <p>{lesson.reading.scienceExample.closing}</p>
        </aside>

        <section className="lesson-block">
          <h3>Valorar el proceso de colaboración</h3>
          <p>{lesson.reading.assessment}</p>
        </section>

        <aside className="lesson-callout lesson-callout-practice">
          <h3>Práctica final</h3>
          <p>{lesson.reading.practice}</p>
          <small>Propuesta para realizar fuera de la plataforma.</small>
        </aside>
      </>}

      {lesson.reading?.type === 'board' && <>
        <aside className="lesson-callout lesson-callout-key">
          <p><strong>{lesson.reading.value}</strong></p>
        </aside>

        <section className="lesson-block">
          <h3>¿Cómo organizar la actividad?</h3>
          <p>{lesson.reading.organization}</p>
          <p>Proponé algunas pautas:</p>
          <ul>{lesson.reading.guidelines.map(item => <li key={item}>{item}</li>)}</ul>
          <p>{lesson.reading.organizationClosing}</p>
        </section>

        <aside className="lesson-callout">
          <h3>Ejemplo aplicado al aula</h3>
          <p>{lesson.reading.example.intro}</p>
          <ul>{lesson.reading.example.columns.map(item => <li key={item}><strong>{item}</strong></li>)}</ul>
          <p>{lesson.reading.example.closing}</p>
        </aside>

        <section className="lesson-block">
          <h3>¿Qué observar como docente?</h3>
          <p>{lesson.reading.observation} <strong>{lesson.reading.observationKey}</strong></p>
          <p>{lesson.reading.access}</p>
        </section>

        <aside className="lesson-callout lesson-callout-practice">
          <h3>Propuesta de práctica</h3>
          <p>{lesson.reading.practice.intro}</p>
          <ol className="lesson-numbered-list">
            {lesson.reading.practice.columns.map(([title, description]) => (
              <li key={title}><strong>{title}:</strong> {description}</li>
            ))}
          </ol>
          <p>{lesson.reading.practice.closing}</p>
          <small>Propuesta para realizar fuera de la plataforma.</small>
        </aside>

        <aside className="lesson-callout lesson-callout-key">
          <p><strong>Idea clave:</strong> {lesson.reading.keyIdea}</p>
        </aside>
      </>}

      {lesson.materials?.length > 0 && <section className="lesson-block">
        <h3><FileText size={19} /> Material de la leccion</h3>
        {lesson.materials.map((material) => {
          const label = typeof material === 'string'
            ? material.replace('Presentacion: ', '').replace('Guia: ', '')
            : material.label
          return typeof material === 'string' ? (
            <div className="asset-row" key={material}>PDF - {label}</div>
          ) : (
            <a className="asset-row asset-link" href={material.href} target="_blank" rel="noreferrer" key={material.href}>
              PDF - {label} <span>Abrir o descargar</span>
            </a>
          )
        })}
      </section>}

      {!embedded && (lesson.video || lesson.media?.length > 0) && <section className="lesson-block">
        <h3><PlayCircle size={19} /> Video</h3>
        {lesson.video ? (
          <>
            <p><strong>Objetivo:</strong> {lesson.video.objective}</p>
            <h3>{lesson.video.title}</h3>
            {lesson.video.duration && <p>Duración: {lesson.video.duration}</p>}
            <video
              className="lesson-video"
              src={lesson.video.src}
              controls
              playsInline
              preload="metadata"
              aria-label={lesson.video.title}
              onError={() => setVideoError(true)}
            >
              Tu navegador no admite la reproducción de video.
            </video>
            {videoError && (
              <p className="video-error" role="alert">
                No se pudo cargar el video. Comprobá tu conexión y recargá la página para volver a intentarlo.
              </p>
            )}
            <div className="asset-row">
              <h3>Para reflexionar</h3>
              <p>{lesson.video.reflection}</p>
            </div>
          </>
        ) : lesson.media.map((item) => (
          <div className="asset-row" key={item}>{item.replace('Video: ', '')}</div>
        ))}
      </section>}

      {!embedded && <>
      <button className="button lesson-complete" type="button" onClick={onComplete} disabled={completed}>
        <CheckCircle2 size={18} /> {completed ? 'Lección completada' : 'Marcar como completada'}
      </button>

      <div className="lesson-actions">
        <button className="button button-secondary" type="button" onClick={onPrevious} disabled={!hasPrevious}>
          <ArrowLeft size={18} /> Anterior
        </button>
        <button className="button" type="button" onClick={onNext} disabled={!hasNext}>
          Siguiente <ArrowRight size={18} />
        </button>
      </div>
      </>}
    </article>
  )
}

export default CourseContent
