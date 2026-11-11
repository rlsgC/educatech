import { Sparkles } from 'lucide-react'
import GamificationCard from './GamificationCard'

function PointsCounter({ points }) {
  return (
    <GamificationCard>
      <div className="metric-card metric-points">
        <div className="metric-icon"><Sparkles size={22} /></div>
        <div>
          <span>Puntos</span>
          <strong>{points} puntos</strong>
        </div>
      </div>
    </GamificationCard>
  )
}

export default PointsCounter
