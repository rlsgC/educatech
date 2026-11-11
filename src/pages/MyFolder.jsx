import { Award, BellRing, Briefcase, Clock, Download, FileText, Info, Plus, QrCode, ShieldCheck, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import RobotPortal from '../components/RobotPortal'
import { useCertificates } from '../data/certificateState'
import { deleteExternalCourse, noticesOf, saveExternalCourse, setNotice, useLearningState } from '../data/learningState'
import { INSTITUTIONS, coursePuntaje, estimatePuntaje, formatPuntos } from '../data/puntaje'
import { describeCertificate, downloadCertificatePdf, sortCertificates } from '../utils/certificates'
import { courseIcons } from '../utils/courseIcons'

const hoursOf = text => Number.parseInt(String(text || '').match(/\d+/)?.[0] ?? '0', 10)

function ExternalCourseForm({ onClose }) {
  const [form, setForm] = useState({ title: '', institution: INSTITUTIONS[0], hours: '', hourType: 'reloj', date: '', fileName: '' })
  const [error, setError] = useState('')
  const update = field => event => setForm(current => ({ ...current, [field]: event.target.value }))
  const submit = event => {
    event.preventDefault()
    const hours = Number.parseInt(form.hours, 10)
    if (!form.title.trim()) return setError('Escribí el nombre del curso.')
    if (!hours || hours < 1) return setError('Indicá cuántas horas tiene el curso.')
    saveExternalCourse({ ...form, title: form.title.trim(), hours })
    onClose()
  }
  return (
    <div className="rd-backdrop" role="presentation" onClick={onClose}>
      <form className="rd-folder-form" role="dialog" aria-modal="true" aria-labelledby="external-title" onClick={event => event.stopPropagation()} onSubmit={submit}>
        <div className="rd-folder-form-head">
          <h2 id="external-title">Agregar curso de otra institución</h2>
          <button className="rd-icon-btn" type="button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </div>
        <label>Nombre del curso<input value={form.title} onChange={update('title')} placeholder="Como figura en el certificado" autoFocus /></label>
        <label>Institución<select value={form.institution} onChange={update('institution')}>{INSTITUTIONS.map(item => <option key={item}>{item}</option>)}</select></label>
        <div className="rd-folder-form-row">
          <label>Horas<input type="number" min="1" inputMode="numeric" value={form.hours} onChange={update('hours')} /></label>
          <label>Tipo de horas<select value={form.hourType} onChange={update('hourType')}><option value="reloj">Reloj</option><option value="cátedra">Cátedra</option></select></label>
        </div>
        <label>Fecha del certificado<input type="date" value={form.date} onChange={update('date')} /></label>
        <label>Certificado (PDF)<input type="file" accept="application/pdf" onChange={event => setForm(current => ({ ...current, fileName: event.target.files?.[0]?.name ?? '' }))} /></label>
        <small>En esta versión de prueba se guarda solo el nombre del archivo. Con el servidor, el PDF quedará guardado en tu carpeta.</small>
        {error && <p className="rd-folder-error" role="alert">{error}</p>}
        <div className="rd-folder-form-actions">
          <button className="rd-btn rd-btn-soft" type="button" onClick={onClose}>Cancelar</button>
          <button className="rd-btn rd-btn-primary" type="submit">Guardar en mi carpeta</button>
        </div>
      </form>
    </div>
  )
}

function MyFolder() {
  const certificates = sortCertificates(useCertificates()).map(describeCertificate)
  const learning = useLearningState()
  const notices = noticesOf(learning)
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const ownRows = certificates.map(certificate => {
    const puntaje = coursePuntaje(certificate.courseData)
    const [Icon] = courseIcons[certificate.courseData?.id] ?? [Award]
    return { key: `cert-${certificate.id}`, kind: 'own', certificate, title: certificate.course, source: 'educatech', icon: Icon, tone: certificate.tone, hours: hoursOf(certificate.courseData?.teachingHours || certificate.hours), hoursLabel: certificate.courseData?.teachingHours || certificate.hours || '—', proof: certificate.code, puntaje }
  })
  const externalRows = learning.external.map(course => {
    const estimate = estimatePuntaje({ institution: course.institution, hours: course.hours })
    return { key: course.id, kind: 'external', course, title: course.title, source: `${course.institution} · cargado por vos`, icon: FileText, tone: 'blue', hours: course.hours, hoursLabel: `${course.hours} h ${course.hourType === 'cátedra' ? 'cát.' : ''}`.trim(), proof: course.fileName || 'Sin archivo', estimate }
  })
  const rows = [...ownRows, ...externalRows]
  const totalHours = rows.reduce((sum, row) => sum + (row.hours || 0), 0)
  // Solo se suman cursos con escala publicada; los de educatech no tienen aval oficial todavía.
  const estimated = externalRows.reduce((sum, row) => sum + (row.estimate?.puntos || 0), 0)

  const downloadOne = async certificate => {
    setBusy(certificate.id)
    try { await downloadCertificatePdf(certificate) } finally { setBusy(null) }
  }

  return (
    <div className="rd-page rd-folder">
      <section className="rd-folder-hero" aria-labelledby="folder-title">
        <RobotPortal size={150} className="rd-portal-folder" state="celebra" once />
        <div className="rd-folder-hero-copy">
          <span className="rd-hero-eyebrow"><Briefcase size={14} /> Mi carpeta</span>
          <h1 id="folder-title">Tus cursos y certificados, listos para la Junta</h1>
          <div className="rd-folder-hero-actions">
            <button className="rd-btn rd-btn-amber" type="button" onClick={() => setAdding(true)}><Plus size={17} /> Agregar curso de otra institución</button>
            {certificates.length > 0 && <button className="rd-btn rd-btn-glass" type="button" onClick={() => downloadCertificatePdf(certificates)}><Download size={17} /> Descargar mis certificados</button>}
          </div>
        </div>
        <div className="rd-folder-stats">
          <div><span className="rd-step-tile tone-violet is-solid" aria-hidden="true"><Clock size={21} /></span><span><strong>{totalHours} h</strong><small>de formación</small></span></div>
          <div><span className="rd-step-tile tone-amber is-solid" aria-hidden="true"><Award size={21} /></span><span><strong>{rows.length}</strong><small>{rows.length === 1 ? 'curso con certificado' : 'cursos con certificado'}</small></span></div>
          <div><span className="rd-step-tile tone-green is-solid" aria-hidden="true"><ShieldCheck size={21} /></span><span><strong>{estimated ? formatPuntos(estimated) : '—'}</strong><small>puntaje estimado</small></span></div>
        </div>
      </section>

      <div className="rd-folder-grid">
        <section className="rd-card rd-folder-table" aria-labelledby="folder-table-title">
          <h2 id="folder-table-title" className="sr-only">Cursos y certificados</h2>
          <div className="rd-folder-row rd-folder-row-head" aria-hidden="true"><span>Curso</span><span>Horas</span><span>Certificado</span><span>Puntaje</span><span /></div>
          {rows.length === 0 && <p className="rd-folder-empty">Todavía no tenés certificados. Cuando apruebes un curso, aparece acá. También podés agregar cursos de otras instituciones.</p>}
          {rows.map(row => (
            <div className="rd-folder-row" key={row.key}>
              <span className="rd-folder-course">
                <span className={`rd-step-tile tone-${row.tone}`} aria-hidden="true"><row.icon size={18} /></span>
                <span><strong>{row.title}</strong><small>{row.source}</small></span>
              </span>
              <span className="rd-folder-cell" data-label="Horas"><strong>{row.hoursLabel}</strong></span>
              <span className="rd-folder-cell" data-label="Certificado">{row.proof}</span>
              <span className="rd-folder-cell" data-label="Puntaje">
                {row.kind === 'own'
                  ? <span className={`rd-puntaje tone-${row.puntaje.tone}`}>{row.puntaje.estado === 'con' ? `Con puntaje · ${row.puntaje.resolucion}` : row.puntaje.label}</span>
                  : row.estimate && !row.estimate.belowMinimum
                    ? <span className="rd-folder-estimate"><strong>{formatPuntos(row.estimate.puntos)}</strong><small>estimado · {row.estimate.norma}</small></span>
                    : row.estimate?.belowMinimum
                      ? <span className="rd-puntaje tone-violet">Menos horas que el mínimo de la escala</span>
                      : <span className="rd-puntaje tone-amber">A confirmar por la Junta</span>}
              </span>
              <span className="rd-folder-action">
                {row.kind === 'own'
                  ? <button className="rd-btn rd-btn-soft rd-btn-sm" type="button" onClick={() => downloadOne(row.certificate)} disabled={busy === row.certificate.id}><Download size={15} /> {busy === row.certificate.id ? 'Generando…' : 'Descargar'}</button>
                  : confirmDelete === row.course.id
                    ? <button className="rd-btn rd-btn-danger rd-btn-sm" type="button" onClick={() => { deleteExternalCourse(row.course.id); setConfirmDelete(null) }}>Confirmar</button>
                    : <button className="rd-btn rd-btn-soft rd-btn-sm" type="button" onClick={() => setConfirmDelete(row.course.id)} aria-label={`Quitar ${row.title} de mi carpeta`}><Trash2 size={15} /> Quitar</button>}
              </span>
            </div>
          ))}
          <p className="rd-folder-note"><Info size={17} aria-hidden="true" /> El puntaje es una estimación orientativa según la escala publicada. El puntaje oficial lo asigna la Junta de Clasificación. Los cursos de educatech todavía no tienen aval oficial.</p>
        </section>

        <aside className="rd-folder-side">
          <section className="rd-folder-alert">
            <span className="rd-step-tile tone-deep" aria-hidden="true"><BellRing size={21} /></span>
            <h2>Inscripciones oficiales con puntaje</h2>
            <p>Cuando la FDCI o el INFoD abran una inscripción para tu nivel y área, te avisamos para que no pierdas el cupo.</p>
            <label className="rd-switch">
              <span>Avisarme</span>
              <input type="checkbox" checked={notices.officialEnrollments} onChange={event => setNotice('officialEnrollments', event.target.checked)} />
              <span className="rd-switch-track" aria-hidden="true" />
            </label>
          </section>
          <section className="rd-card rd-folder-verify">
            <div><span className="rd-step-tile tone-green is-solid" aria-hidden="true"><QrCode size={21} /></span><h2>Certificados verificables</h2></div>
            <p>Cada certificado de educatech trae un código único (por ejemplo, {certificates[0]?.code ?? 'ET-2026-0001'}) para que una escuela o la Junta pueda comprobar que es auténtico.</p>
          </section>
        </aside>
      </div>

      {adding && <ExternalCourseForm onClose={() => setAdding(false)} />}
    </div>
  )
}

export default MyFolder
