import { FileText } from 'lucide-react'
import { courseIcons } from '../utils/courseIcons'
import { courseTone } from '../utils/learning'

function CourseCover({ course, label, size = 'md', className = '', children }) {
  const [Icon] = courseIcons[course.id] ?? [FileText]
  return (
    <div className={`rd-cover rd-cover-${size} tone-${courseTone(course)} ${className}`}>
      {label && <span className="rd-chip rd-cover-chip">{label}</span>}
      {children}
      <span className="rd-cover-tile" aria-hidden="true"><Icon strokeWidth={1.8} /></span>
    </div>
  )
}

export default CourseCover
