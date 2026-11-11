import { Download, ExternalLink, FileText, PlayCircle } from 'lucide-react'
import { recordResourceDownload } from '../utils/activityLog'

function ResourceItem({ resource }) {
  const Icon = resource.type === 'Videos' ? PlayCircle : resource.type === 'Enlaces' ? ExternalLink : FileText

  return (
    <article className="resource-item">
      <div className="resource-icon">
        <Icon size={21} />
      </div>
      <div>
        <strong>{resource.title}</strong>
        <span>{resource.type}</span>
      </div>
      {resource.href && <a className="icon-button icon-button-soft" href={resource.href} download onClick={() => recordResourceDownload(resource)} aria-label={`Descargar ${resource.title}`}><Download size={18} /></a>}
    </article>
  )
}

export default ResourceItem
