import { ExternalLink, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import ToolVisual from './ToolVisual'

function validUrl(value) {
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}

function ToolGuide({ tool, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!tool) return undefined
    const previousFocus = document.activeElement
    closeRef.current?.focus()
    const closeOnEscape = event => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      previousFocus?.focus?.()
    }
  }, [tool, onClose])

  if (!tool) return null
  const steps = Array.isArray(tool.steps) ? tool.steps : []

  return (
    <div className="tool-guide-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <article className="tool-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="tool-guide-title" aria-describedby="tool-guide-purpose">
        <button ref={closeRef} className="preferences-close" type="button" onClick={onClose} aria-label="Cerrar guía"><X size={21} /></button>
        <span className="tool-card-icon"><ToolVisual visual={tool.visual} /></span>
        <h2 id="tool-guide-title">{tool.name}</h2>
        <section><h3>Para qué sirve</h3><p id="tool-guide-purpose">{tool.purpose}</p></section>
        <section><h3>Ejemplo de aplicación en el aula</h3><p>{tool.example}</p></section>
        <section><h3>Pasos básicos de uso</h3>{steps.length > 0 ? <ol>{steps.map((step, index) => <li key={`${tool.id}-${index}`}>{step}</li>)}</ol> : <p>La guía paso a paso todavía no está disponible.</p>}</section>
        {validUrl(tool.officialUrl) && <a className="button" href={tool.officialUrl} target="_blank" rel="noreferrer">Abrir herramienta <ExternalLink size={17} /></a>}
      </article>
    </div>
  )
}

export default ToolGuide
