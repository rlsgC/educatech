import { FileText, Sparkles } from 'lucide-react'
import { courseIcons } from '../utils/courseIcons'

function CourseThumbnail({ course, className = '' }) {
  const [PrimaryIcon, SecondaryIcon] = courseIcons[course.id] ?? [FileText, Sparkles]
  return (
    <div className={`course-thumbnail thumbnail-${course.imageTone} ${className}`} aria-hidden="true">
      <span className="course-thumbnail-main"><PrimaryIcon size={42} strokeWidth={1.8} /></span>
      <span className="course-thumbnail-secondary"><SecondaryIcon size={23} strokeWidth={2} /></span>
    </div>
  )
}

export default CourseThumbnail
