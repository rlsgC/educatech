import { Flame } from 'lucide-react'
import GamificationCard from './GamificationCard'
import TeacherMascot from './TeacherMascot'

function StreakCounter({ days }) {
  return (
    <GamificationCard className="streak-card">
      <div className="metric-card metric-amber">
        <div className="metric-icon"><Flame size={22} /></div>
        <div>
          <span>Racha</span>
          <strong>{days} dias seguidos</strong>
        </div>
      </div>
      {days >= 7 && (
        <TeacherMascot
          variant="celebration"
          size={92}
          className="streak-mascot"
          alt="Mascota docente de EducaTech celebrando la racha"
        />
      )}
    </GamificationCard>
  )
}

export default StreakCounter
