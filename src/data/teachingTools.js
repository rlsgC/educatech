// Catálogo único de herramientas verificadas. La interfaz no muestra datos ficticios.
// Para cargar una herramienta se necesitan datos editoriales reales con este formato:
// {
//   id: 'identificador-unico',
//   name: 'Nombre oficial',
//   description: 'Aplicación breve en el aula',
//   areas: ['Matemática'],
//   levels: ['Secundario'],
//   visual: 'calculator',
//   purpose: 'Para qué sirve',
//   example: 'Ejemplo concreto y verificado',
//   steps: ['Paso 1', 'Paso 2'],
//   officialUrl: 'https://...' // opcional; solo si fue verificada
// }
export const teachingTools = []

export function recommendTools(preferences, limit = 3, catalog = teachingTools) {
  if (preferences.status !== 'completed') return []
  const seen = new Set()

  return catalog
    .map((tool, index) => ({
      tool,
      index,
      matchesArea: Array.isArray(tool.areas) && tool.areas.some(area => preferences.areas.includes(area)),
      matchesLevel: Array.isArray(tool.levels) && tool.levels.some(level => preferences.levels.includes(level)),
    }))
    .filter(item => {
      if (!item.matchesArea || !item.matchesLevel || !item.tool.id || seen.has(item.tool.id)) return false
      seen.add(item.tool.id)
      return true
    })
    .sort((a, b) => a.index - b.index)
    .slice(0, limit)
    .map(item => item.tool)
}
