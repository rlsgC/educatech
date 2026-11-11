import { Award, BookOpen, Compass, Lightbulb, Play, Sparkles, Zap } from 'lucide-react'

const icons = { play: Play, book: BookOpen, zap: Zap, sparkles: Sparkles, compass: Compass, award: Award, lightbulb: Lightbulb }

function AchievementIcon({ name, size = 18 }) {
  const Icon = icons[name] ?? Award
  return <Icon size={size} />
}

export default AchievementIcon
