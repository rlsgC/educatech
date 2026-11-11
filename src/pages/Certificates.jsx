import { ArrowRight, Award, BarChart3, CalendarDays, Clock, Download, Eye, Plus, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RobotPortal from '../components/RobotPortal'
import { useCertificates } from '../data/certificateState'
import { courses } from '../data/courses'
import { getCourseProgress, isCourseFinished, useEnrolledCourses } from '../data/courseState'
import { finalAssessments } from '../data/finalAssessments'
import { currentProfile } from '../data/profile'
import { describeCertificate, downloadCertificatePdf, sortCertificates } from '../utils/certificates'
import AchievementIcon from '../components/AchievementIcon'
import { courseTone } from '../utils/learning'
import { useLearnerStats } from '../utils/useLearnerStats'

function useDownload() {
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState('')
  const run = async (key, list) => {
    setBusy(key)
    setError('')
    try {
      await downloadCertificatePdf(list)
    } catch {
      setError('No pudimos generar el PDF. Probá de nuevo en unos segundos.')
    } finally {
      setBusy(null)
    }
  }
  return { busy, error, run }
}

function CertificateCard({ certificate, onOpen, onDownload, busy }) {
  return (
    <article className="rd-card rd-cert-card">
      <div className={`rd-cert-cover tone-${certificate.tone}`} aria-hidden="true">
        <div className="rd-cert-paper">
          <span>EDUCATECH</span>
          <i style={{ width: '80%' }} /><i style={{ width: '60%' }} /><i style={{ width: '70%' }} />
          <b><Award size={18} /></b>
        </div>
      </div>
      <div className="rd-cert-body">
        <span className={`rd-category tone-text-${certificate.tone}`}>{certificate.category}</span>
        <h3>{certificate.course}</h3>
        <span className="rd-muted"><CalendarDays size={14} /> Obtenido el {certificate.date}{certificate.hours ? ` · ${certificate.hours}` : ''}</span>
        {certificate.sample && <span className="rd-muted">Muestra sin validez oficial</span>}
        <div className="rd-cert-actions">
          <button className="rd-btn rd-btn-soft" type="button" onClick={() => onOpen(certificate)}><Eye size={17} /> Ver certificado</button>
          <button className="rd-icon-btn rd-icon-btn-lg" type="button" onClick={() => onDownload(certificate)} disabled={busy} aria-label={`Descargar PDF del certificado de ${certificate.course}`}><Download size={18} /></button>
        </div>
      </div>
    </article>
  )
}

function CertificateDialog({ certificate, onClose, onDownload, busy }) {
  useEffect(() => {
    const onKey = event => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="reminder-overlay" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="rd-cert-dialog" role="dialog" aria-modal="true" aria-labelledby="certificate-title">
        <div className="rd-cert-dialog-head">
          <strong>Vista del certificado</strong>
          <button className="rd-icon-btn rd-icon-btn-lg" type="button" onClick={onClose} aria-label="Cerrar certificado" autoFocus><X size={18} /></button>
        </div>
        <div className="rd-diploma">
          <span className="rd-diploma-brand">EducaTech · Formación docente</span>
          <h2 id="certificate-title">{certificate.sample ? 'Certificado de muestra' : 'Certificado de aprobación'}</h2>
          <p>Se certifica que</p>
          <strong className="rd-diploma-name">{currentProfile.fullName}</strong>
          <p>completó satisfactoriamente el curso</p>
          <strong className="rd-diploma-course">{certificate.course}</strong>
          <div className="rd-diploma-foot">
            <div><span>Fecha</span><strong>{certificate.date}</strong></div>
            <span className="rd-diploma-seal" aria-hidden="true"><Award size={34} strokeWidth={1.9} /></span>
            <div><span>Código</span><strong>{certificate.code}</strong></div>
          </div>
          {certificate.sample && <small>Demostración sin validez oficial</small>}
        </div>
        <div className="rd-cert-dialog-actions">
          <button className="rd-btn rd-btn-ghost" type="button" onClick={onClose}>Cerrar</button>
          <button className="rd-btn rd-btn-primary" type="button" onClick={() => onDownload(certificate)} disabled={busy}><Download size={17} /> {busy ? 'Generando PDF…' : 'Descargar PDF'}</button>
        </div>
      </section>
    </div>
  )
}

function UpcomingCertificates({ courses: activeCourses }) {
  return (
    <section className="rd-card rd-side-card" aria-labelledby="upcoming-title">
      <span className="rd-eyebrow">En camino</span>
      <h2 id="upcoming-title" className="rd-side-title">Próximos certificados</h2>
      {activeCourses.length ? (
        <div className="rd-upcoming">
          {activeCourses.map(course => {
            const progress = getCourseProgress(course)
            const missing = progress.totalModules - progress.completedModules
            return (
              <div key={course.id}>
                <div className="rd-upcoming-top"><strong>{course.title}</strong><span>{progress.percentage}%</span></div>
                <div className={`rd-progress tone-${courseTone(course)}`}><span><span style={{ width: `${progress.percentage}%`, background: 'var(--solid)' }} /></span></div>
                <span className="rd-muted">{progress.completedModules} de {progress.totalModules} módulos · {missing > 0 ? `faltan ${missing}` : 'contenidos completos'}{finalAssessments[course.id] ? ' y la evaluación final' : ''}</span>
              </div>
            )
          })}
        </div>
      ) : <p className="rd-muted rd-empty-note">No tenés cursos en progreso. Elegí uno del catálogo para sumar tu próximo certificado.</p>}
      <Link className="rd-link rd-side-more" to="/mis-cursos">Ir a mis cursos <ArrowRight size={16} /></Link>
    </section>
  )
}

function LevelCard({ level }) {
  return (
    <section className="rd-card rd-side-card" aria-labelledby="level-title">
      <div className="rd-side-head">
        <div><span className="rd-eyebrow">Tu nivel</span><h2 id="level-title">{level.title}</h2></div>
        <span className="rd-level-badge" aria-label={`Nivel ${level.number}`}>{level.number}</span>
      </div>
      <div className="rd-level-bar" role="progressbar" aria-valuemin={0} aria-valuemax={level.nextLevel?.min ?? level.points} aria-valuenow={level.points} aria-label="Puntos para el próximo nivel"><span style={{ width: `${level.percentage}%` }} /></div>
      <div className="rd-level-foot">
        <span>{level.nextLevel ? `${level.points} / ${level.nextLevel.min} puntos` : `${level.points} puntos`}</span>
        <span>{level.nextLevel ? `Faltan ${level.pointsToNext} para el nivel ${level.nextLevel.number}` : '¡Nivel máximo alcanzado!'}</span>
      </div>
      <p className="rd-level-help">Sumás puntos al completar lecciones (+10), módulos (+30), inscribirte (+15), descargar recursos (+5) y obtener certificados (+50).</p>
    </section>
  )
}

function Badges({ achievements }) {
  return (
    <section className="rd-card rd-side-card" aria-labelledby="badges-title">
      <h2 id="badges-title">Insignias</h2>
      <ul className="rd-badges">
        {achievements.map(item => (
          <li key={item.id} className={item.unlocked ? '' : 'locked'}>
            <span className={`rd-icon-tile ${item.unlocked ? `tone-${item.tone}` : ''}`}><AchievementIcon name={item.icon} /></span>
            <div>
              <strong>{item.title}</strong>
              <span>{item.unlocked ? 'Desbloqueada' : `${item.description} · ${Math.min(item.current, item.goal)}/${item.goal}`}</span>
              {!item.unlocked && <i className="rd-badge-bar"><b style={{ width: `${item.progress}%` }} /></i>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Certificates() {
  const certificates = sortCertificates(useCertificates()).map(describeCertificate)
  const enrolled = useEnrolledCourses(courses)
  const active = enrolled.filter(course => !isCourseFinished(course))
  const [selected, setSelected] = useState(null)
  const { busy, error, run } = useDownload()
  const latest = certificates[0]
  const stats = useLearnerStats()
  const downloadOne = certificate => run(certificate.id, [certificate])

  return (
    <div className="rd-page">
      <div className="rd-page-head">
        <div>
          <span className="rd-kicker">Tus logros</span>
          <h1>Mis certificados</h1>
          <p>Cada certificado refleja nuevas herramientas para llevar al aula.</p>
        </div>
        {certificates.length > 0 && (
          <button className="rd-btn rd-btn-dark" type="button" onClick={() => run('all', certificates)} disabled={Boolean(busy)}>
            <Download size={17} /> {busy === 'all' ? 'Generando PDF…' : 'Descargar todos (PDF)'}
          </button>
        )}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="rd-kpis">
        <div className="rd-card rd-kpi rd-kpi-row"><span className="rd-icon-tile tone-amber"><Award size={20} /></span><div><strong>{certificates.length}</strong><span>Certificados obtenidos</span></div></div>
        <div className="rd-card rd-kpi rd-kpi-row"><span className="rd-icon-tile tone-violet"><Sparkles size={20} /></span><div><strong>{stats.points}</strong><span>Puntos acumulados</span></div></div>
        <div className="rd-card rd-kpi rd-kpi-row"><span className="rd-icon-tile tone-green"><BarChart3 size={20} /></span><div><strong>Nivel {stats.level.number}</strong><span>{stats.level.title}</span></div></div>
        <div className="rd-card rd-kpi rd-kpi-row"><span className="rd-icon-tile tone-blue"><Clock size={20} /></span><div><strong>{active.length}</strong><span>En camino a certificar</span></div></div>
      </div>

      {latest ? (
        <section className="rd-hero rd-hero-cert" aria-labelledby="latest-title">
          <RobotPortal size={200} className="rd-portal-cert" state="celebra" once />
          <div className="rd-hero-copy">
            <span className="rd-hero-eyebrow"><Award size={14} /> Tu último logro</span>
            <h2 id="latest-title">{latest.course}</h2>
            <p>Certificado obtenido el {latest.date} · Formación docente EducaTech</p>
            <div className="rd-hero-actions">
              <button className="rd-btn rd-btn-amber" type="button" onClick={() => setSelected(latest)}><Eye size={17} /> Ver certificado</button>
              <button className="rd-btn rd-btn-glass" type="button" onClick={() => downloadOne(latest)} disabled={Boolean(busy)}><Download size={17} /> {busy === latest.id ? 'Generando…' : 'Descargar PDF'}</button>
            </div>
          </div>
        </section>
      ) : (
        <section className="rd-hero rd-hero-cert" aria-labelledby="latest-title">
          <RobotPortal size={200} className="rd-portal-cert" state="saludo" />
          <div className="rd-hero-copy">
            <span className="rd-hero-eyebrow"><Award size={14} /> Tu primer logro te espera</span>
            <h2 id="latest-title">Todavía no tenés certificados</h2>
            <p>Completá un curso para obtener tu primer certificado.</p>
            <Link className="rd-btn rd-btn-amber" to="/mis-cursos">Ir a mis cursos <ArrowRight size={17} /></Link>
          </div>
        </section>
      )}

      <div className="rd-layout">
        <section className="rd-main-col" aria-labelledby="collection-title">
          <div className="rd-block-head rd-block-head-tight">
            <div><span className="rd-eyebrow">Tu colección</span><h2 id="collection-title">Certificados obtenidos</h2></div>
            <span className="rd-muted">{certificates.length === 1 ? '1 certificado' : `${certificates.length} certificados`}</span>
          </div>
          <div className="rd-cert-grid">
            {certificates.map(certificate => (
              <CertificateCard key={certificate.id} certificate={certificate} onOpen={setSelected} onDownload={downloadOne} busy={Boolean(busy)} />
            ))}
            <Link className="rd-add-course rd-add-cert" to="/catalogo">
              <span><Plus size={20} /></span>
              <strong>Tu próximo certificado</strong>
              <small>Elegí un curso del catálogo y sumalo a tu colección.</small>
            </Link>
          </div>
        </section>

        <aside className="rd-side-col" aria-label="Progreso y logros">
          <UpcomingCertificates courses={active} />
          <LevelCard level={stats.level} />
          <Badges achievements={stats.achievements} />
        </aside>
      </div>

      {selected && <CertificateDialog certificate={selected} onClose={() => setSelected(null)} onDownload={downloadOne} busy={Boolean(busy)} />}
    </div>
  )
}

export default Certificates
