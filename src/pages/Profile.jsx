import { ArrowRight, Bell, Check, CheckCircle2, Flame, Info, Lightbulb, Mail, MessageSquare, Pencil, School, User, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AchievementIcon from '../components/AchievementIcon'
import Mascot from '../components/Mascot'
import PreferencesForm from '../components/PreferencesForm'
import { RobotBubble } from '../components/RobotPortal'
import { REFLECTION_RESULTS, appliedIdeas, noticesOf, setNotice, useLearningState } from '../data/learningState'
import { savePreferences, usePreferences } from '../data/preferences'
import { currentProfile } from '../data/profile'
import { useCertificates } from '../data/certificateState'
import { POINTS } from '../utils/progress'
import { describeCertificate } from '../utils/certificates'
import { initialsOf } from '../utils/learning'
import { useLearnerStats } from '../utils/useLearnerStats'

const EARN = [
  { label: 'Completar una lección', points: POINTS.lesson, tone: 'violet', icon: CheckCircle2 },
  { label: 'Contar cómo te fue con una idea', points: POINTS.reflection, tone: 'rose', icon: MessageSquare },
  { label: 'Terminar un módulo', points: POINTS.module, tone: 'green', icon: Check },
  { label: 'Obtener un certificado', points: POINTS.certificate, tone: 'amber', icon: Zap },
]

const RESULT_TONE = { funciono: 'green', 'mas-o-menos': 'amber', 'no-pude': 'violet' }

const NOTICES = [
  ['reminders', 'Recordatorios para estudiar', 'Los días y horarios que agendaste'],
  ['followUp', '¿Cómo te fue?', 'Te preguntamos 2 días después de elegir una idea'],
  ['officialEnrollments', 'Inscripciones oficiales con puntaje', 'FDCI e INFoD, para tu nivel y área'],
  ['catalogNews', 'Novedades del catálogo', 'Cursos nuevos de educatech'],
]

const shortDate = iso => new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(new Date(iso)).replace('.', '')
const hoursOf = text => Number.parseInt(String(text || '').match(/\d+/)?.[0] ?? '0', 10)

function Profile() {
  const preferences = usePreferences()
  const [editing, setEditing] = useState(false)
  const stats = useLearnerStats()
  const learning = useLearningState()
  const notices = noticesOf(learning)
  const certificates = useCertificates().map(describeCertificate)
  const applied = appliedIdeas(learning)
  const worked = learning.reflections.filter(item => item.result === 'funciono').length
  const hours = certificates.reduce((sum, item) => sum + hoursOf(item.courseData?.teachingHours || item.hours), 0)
    + learning.external.reduce((sum, item) => sum + (item.hours || 0), 0)
  const { level, points, streak, achievements } = stats
  const unlocked = achievements.filter(item => item.unlocked).length
  const closest = achievements.filter(item => !item.unlocked).sort((a, b) => b.progress - a.progress)[0]
  const teaches = [...preferences.levels, ...preferences.areas]

  const save = (levels, areas) => {
    if (savePreferences(levels, areas)) setEditing(false)
  }

  const bubble = level.nextLevel
    ? `¡Ya sos ${level.title}! Con ${level.pointsToNext} chispas más subís de nivel.`
    : `¡Llegaste al nivel máximo: ${level.title}!`

  return (
    <div className="rd-page rd-profile">
      <section className="rd-profile-hero" aria-labelledby="profile-title">
        <div className="rd-profile-id">
          <span className="rd-profile-avatar" aria-hidden="true">{initialsOf(currentProfile.fullName) || currentProfile.initials}</span>
          <div>
            <h1 id="profile-title">{currentProfile.fullName}</h1>
            <span className="rd-profile-role">{currentProfile.role} · {currentProfile.institution}</span>
            <div className="rd-profile-chips">
              <span className="dark"><Zap size={14} /> Nivel {level.number} · {level.title}</span>
              {teaches.length > 0 && <span>{teaches.slice(0, 3).join(' · ')}</span>}
            </div>
            <button className="rd-btn rd-btn-white" type="button" onClick={() => setEditing(true)}><Pencil size={16} /> Editar qué enseño</button>
          </div>
        </div>
        <div className="rd-profile-robot">
          <RobotBubble>{bubble}</RobotBubble>
          <Mascot state="saludo" className="rd-profile-bot" />
        </div>
      </section>

      <div className="rd-profile-two">
        <section className="rd-profile-level" aria-labelledby="level-title">
          <div className="rd-profile-level-top">
            <span className="rd-ring rd-ring-lg" style={{ '--pct': `${level.percentage}%` }} role="img" aria-label={`${points} chispas`}><span><strong>{points}</strong><small>chispas</small></span></span>
            <div>
              <span className="rd-profile-kicker">Tu nivel</span>
              <h2 id="level-title">Nivel {level.number} · {level.title}</h2>
              <p>{level.nextLevel ? <>Te faltan <strong>{level.pointsToNext} chispas</strong> para “{level.nextLevel.title}”.</> : 'Llegaste al nivel máximo.'}</p>
            </div>
          </div>
          <div className="rd-profile-earn">
            <strong>Cómo ganar chispas</strong>
            {EARN.map(({ label, points: value, tone, icon: Icon }) => (
              <div key={label}><span className={`rd-step-tile tone-${tone} is-solid`} aria-hidden="true"><Icon size={16} /></span><span>{label}</span><strong>+{value}</strong></div>
            ))}
          </div>
          <p className="rd-profile-level-note"><Info size={17} aria-hidden="true" /> Las chispas y los niveles son de educatech: muestran tu avance y no son puntaje docente. Tu puntaje está en <Link to="/carpeta">Mi carpeta</Link>.</p>
        </section>

        <section className="rd-card rd-profile-impact" aria-labelledby="impact-title">
          <div className="rd-profile-impact-head">
            <span className="rd-step-tile tone-amber is-solid" aria-hidden="true"><Lightbulb size={22} /></span>
            <div><h2 id="impact-title">Tu impacto en el aula</h2><span>Lo que aprendiste y llevaste a tus clases</span></div>
          </div>
          <div className="rd-profile-impact-stats">
            <div className="tone-amber"><strong>{applied.length}</strong><span>{applied.length === 1 ? 'idea aplicada' : 'ideas aplicadas'}</span></div>
            <div className="tone-green"><strong>{worked}</strong><span>funcionaron bien</span></div>
            <div className="tone-violet"><strong>{hours} h</strong><span>de formación</span></div>
          </div>
          {learning.reflections.length > 0 ? (
            <div className="rd-profile-ideas">
              {[...learning.reflections].reverse().slice(0, 4).map(item => (
                <div key={item.id}>
                  <span className="rd-step-tile tone-amber" aria-hidden="true"><Lightbulb size={18} /></span>
                  <span><strong>{item.title}</strong><small>Contaste cómo te fue el {shortDate(item.date)}</small></span>
                  <span className={`rd-pill tone-${RESULT_TONE[item.result]}`}>{REFLECTION_RESULTS[item.result]}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rd-profile-empty">Todavía no contaste cómo te fue con una idea. Al terminar cada módulo te proponemos una para probar con tus alumnos, y a los dos días te preguntamos en el Inicio cómo resultó.</p>
          )}
          <Link className="rd-link" to="/mis-cursos">Ir a mis cursos <ArrowRight size={16} /></Link>
        </section>
      </div>

      <section className="rd-card rd-profile-badges" aria-labelledby="badges-title">
        <div className="rd-profile-badges-head">
          <div>
            <h2 id="badges-title">Insignias</h2>
            <span>{unlocked} de {achievements.length} desbloqueadas{closest ? ` · la más cercana: “${closest.title}” (${closest.current}/${closest.goal})` : ''}</span>
          </div>
          <span className="rd-profile-streak"><Flame size={15} fill="currentColor" /> Racha actual: {streak.current} {streak.current === 1 ? 'día' : 'días'}</span>
        </div>
        <div className="rd-profile-badge-grid">
          {achievements.map((item, index) => (
            <article key={item.id} className={`rd-badge tone-${item.tone} ${item.unlocked ? 'is-on' : ''}`}>
              {item.id === 'classroom' && <span className="rd-badge-new">Nueva</span>}
              <span className="rd-badge-medal" style={{ '--rot': `${index % 2 ? 8 : -8}deg` }} aria-hidden="true">
                <AchievementIcon name={item.icon} size={28} />
                {item.unlocked && <span className="rd-badge-check"><Check size={14} strokeWidth={3} /></span>}
              </span>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
              {item.unlocked
                ? <small className="rd-badge-state">Desbloqueada</small>
                : <span className="rd-badge-bar" aria-label={`${Math.min(item.current, item.goal)} de ${item.goal}`}><span><span style={{ width: `${item.progress}%` }} /></span><small>{Math.min(item.current, item.goal)}/{item.goal}</small></span>}
            </article>
          ))}
        </div>
      </section>

      <div className="rd-profile-two">
        <section className="rd-card rd-profile-data" aria-labelledby="data-title">
          <h2 id="data-title">Tus datos</h2>
          <div className="rd-profile-field"><span className="rd-step-tile tone-violet" aria-hidden="true"><User size={17} /></span><span><small>Nombre</small><strong>{currentProfile.fullName}</strong></span></div>
          <div className="rd-profile-field"><span className="rd-step-tile tone-blue" aria-hidden="true"><Mail size={17} /></span><span><small>Correo</small><strong>{currentProfile.email}</strong></span></div>
          <div className="rd-profile-field"><span className="rd-step-tile tone-teal" aria-hidden="true"><School size={17} /></span><span><small>Institución</small><strong>{currentProfile.institution}</strong></span></div>
          <div className="rd-profile-teach">
            <div><strong>Qué y dónde enseñás</strong><button className="rd-link" type="button" onClick={() => setEditing(true)}>Cambiar</button></div>
            {teaches.length > 0
              ? <div className="rd-profile-chips">{teaches.map(item => <span key={item}>{item}</span>)}</div>
              : <p>Todavía no lo indicaste.</p>}
            <small>Con esto elegimos las ideas de “Llevalo al aula” y los avisos de inscripciones.</small>
          </div>
        </section>

        <section className="rd-card rd-profile-notices" aria-labelledby="notices-title">
          <div className="rd-profile-notices-head"><span className="rd-step-tile tone-rose is-solid" aria-hidden="true"><Bell size={19} /></span><h2 id="notices-title">Avisos</h2></div>
          {NOTICES.map(([key, label, help]) => (
            <label className="rd-switch rd-switch-row" key={key}>
              <span><strong>{label}</strong><small>{help}</small></span>
              <input type="checkbox" checked={notices[key]} onChange={event => setNotice(key, event.target.checked)} />
              <span className="rd-switch-track" aria-hidden="true" />
            </label>
          ))}
        </section>
      </div>

      {editing && <PreferencesForm mode="edit" initialLevels={preferences.levels} initialAreas={preferences.areas} onSave={save} onCancel={() => setEditing(false)} />}
    </div>
  )
}

export default Profile
