import achievementMascot from '../assets/mascot/teacher-achievement.png'
import celebrationMascot from '../assets/mascot/teacher-celebration.png'
import studyingMascot from '../assets/mascot/teacher-studying.png'
import welcomeMascot from '../assets/mascot/teacher-welcome.png'

const mascotMap = {
  welcome: welcomeMascot,
  studying: studyingMascot,
  celebration: celebrationMascot,
  achievement: achievementMascot,
}

function TeacherMascot({ variant = 'welcome', size = 220, className = '', alt }) {
  const src = mascotMap[variant] ?? mascotMap.welcome
  const resolvedAlt = alt ?? `Mascota docente de EducaTech - ${variant}`

  return (
    <img
      className={`teacher-mascot ${className}`}
      src={src}
      alt={resolvedAlt}
      style={{ '--mascot-size': `${size}px` }}
    />
  )
}

export default TeacherMascot
