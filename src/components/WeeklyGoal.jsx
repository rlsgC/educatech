import { Check } from 'lucide-react'
import { useWeeklyGoal } from '../utils/useWeeklyGoal'

function WeeklyGoal({ title = 'Tu ritmo de aprendizaje', showRing = false }) {
  const { week, done, goal, percentage } = useWeeklyGoal()
  const remaining = Math.max(0, goal - done)
  return (
    <section className="rd-card rd-weekly" aria-labelledby="weekly-goal-title">
      <div className="rd-weekly-head">
        <div>
          <span className="rd-eyebrow">Objetivo semanal</span>
          <h2 id="weekly-goal-title">{title}</h2>
        </div>
        {showRing
          ? <span className="rd-ring" style={{ '--value': `${percentage}%` }} role="img" aria-label={`${percentage}% del objetivo semanal`}><span>{percentage}%</span></span>
          : <strong className="rd-weekly-count">{Math.min(done, goal)}/{goal}</strong>}
      </div>
      <ol className="rd-week" aria-label="Días con estudio esta semana">
        {week.map(day => (
          <li key={day.key}>
            <span className={`rd-day ${day.done ? 'done' : ''} ${day.isToday && !day.done ? 'today' : ''}`} aria-label={`${day.label}: ${day.done ? 'con estudio' : 'sin estudio'}`}>
              {day.done && <Check size={16} strokeWidth={2.6} />}
            </span>
            <span className="rd-day-label">{day.label}</span>
          </li>
        ))}
      </ol>
      <div className="rd-weekly-tip">
        {remaining === 0
          ? <><strong>¡Cumpliste tu objetivo semanal!</strong><span>Seguí sumando para mantener tu racha.</span></>
          : <><strong>{remaining === 1 ? 'Estás a un día de tu meta' : `Te faltan ${remaining} días para tu meta`}</strong><span>Dedicá 15 minutos hoy para avanzar en tu objetivo.</span></>}
      </div>
    </section>
  )
}

export default WeeklyGoal
