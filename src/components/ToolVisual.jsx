import { Beaker, Calculator, Languages, Palette, Shapes, Wrench } from 'lucide-react'

const visuals = {
  calculator: Calculator,
  science: Beaker,
  languages: Languages,
  art: Palette,
  geometry: Shapes,
}

function ToolVisual({ visual, size = 25 }) {
  const Icon = visuals[visual] ?? Wrench
  return <Icon size={size} aria-hidden="true" />
}

export default ToolVisual
