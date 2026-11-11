import ProgressBar from './ProgressBar'
import GamificationCard from './GamificationCard'

function LevelProgress({ level }) {
  const remaining = level.nextLevelPoints - level.currentPoints
  const percent = Math.round((level.currentPoints / level.nextLevelPoints) * 100)

  return (
    <GamificationCard title={`Nivel ${level.number}`}>
      <div className="level-copy">
        <strong>{level.title}</strong>
        <span>{level.currentPoints} / {level.nextLevelPoints} pts</span>
      </div>
      <ProgressBar value={percent} />
      <p>A {remaining} puntos del siguiente nivel.</p>
    </GamificationCard>
  )
}

export default LevelProgress
