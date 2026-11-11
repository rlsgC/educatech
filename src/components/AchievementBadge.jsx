import { Award } from 'lucide-react'

function AchievementBadge({ achievement }) {
  return (
    <div className={`achievement-badge badge-${achievement.tone} ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
      <Award size={18} />
      <span>{achievement.title}</span>
    </div>
  )
}

export default AchievementBadge
