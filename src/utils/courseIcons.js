import {
  BrainCircuit,
  CheckCheck,
  FileText,
  LayoutTemplate,
  MessageCircleHeart,
  ClipboardList,
  FolderKanban,
  Accessibility,
  RefreshCcw,
  Shapes,
  Sparkles,
  UsersRound,
} from 'lucide-react'

export const courseIcons = {
  'herramientas-digitales': [FileText, UsersRound],
  'ia-educacion': [BrainCircuit, Sparkles],
  'evaluacion-formativa': [CheckCheck, FileText],
  'experiencias-aprendizaje': [LayoutTemplate, Shapes],
  'educacion-inclusiva': [UsersRound, MessageCircleHeart],
  'gestion-aula': [MessageCircleHeart, UsersRound],
  'aprendizaje-proyectos': [FolderKanban, UsersRound],
  'aula-invertida': [RefreshCcw, LayoutTemplate],
  'diseno-rubricas': [ClipboardList, CheckCheck],
  'recursos-accesibles': [Accessibility, FileText],
}
