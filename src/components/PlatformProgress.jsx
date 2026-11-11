import ProgressBar from './ProgressBar'
import GamificationCard from './GamificationCard'

function PlatformProgress({ items }) {
  return (
    <GamificationCard title="Tu progreso en la plataforma">
      <div className="platform-progress-list">
        {items.map((item) => (
          <div className="platform-progress-item" key={item.label}>
            <div>
              <span>{item.label}</span>
              <strong>{item.current}/{item.total}</strong>
            </div>
            <ProgressBar value={Math.round((item.current / item.total) * 100)} />
          </div>
        ))}
      </div>
    </GamificationCard>
  )
}

export default PlatformProgress
