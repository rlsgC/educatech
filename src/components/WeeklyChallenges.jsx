import { CheckCircle2, Circle } from 'lucide-react'
import { useState } from 'react'
import GamificationCard from './GamificationCard'

function WeeklyChallenges({ challenges }) {
  const [items, setItems] = useState(challenges)

  const toggleChallenge = (id) => {
    setItems((current) =>
      current.map((item) => item.id === id ? { ...item, completed: !item.completed } : item),
    )
  }

  return (
    <GamificationCard title="Desafios de la semana">
      <div className="challenge-list">
        {items.map((challenge) => {
          const Icon = challenge.completed ? CheckCircle2 : Circle
          return (
            <button
              className={`challenge-item ${challenge.completed ? 'completed' : ''}`}
              key={challenge.id}
              type="button"
              onClick={() => toggleChallenge(challenge.id)}
            >
              <Icon size={18} />
              <span>{challenge.title}</span>
              <strong>+{challenge.points} pts</strong>
            </button>
          )
        })}
      </div>
    </GamificationCard>
  )
}

export default WeeklyChallenges
