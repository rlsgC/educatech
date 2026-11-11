import ToolVisual from './ToolVisual'

function TeachingToolCard({ tool, onOpen }) {
  return (
    <article className="tool-card">
      <span className="tool-card-icon"><ToolVisual visual={tool.visual} /></span>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <button className="button button-secondary" type="button" onClick={() => onOpen(tool)}>Ver cómo usarla</button>
    </article>
  )
}

export default TeachingToolCard
