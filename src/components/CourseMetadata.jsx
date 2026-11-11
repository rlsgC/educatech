import { ArrowRight, Award, Building2, Calendar, CalendarDays, ChevronDown, Clock, Laptop, MapPin, Milestone } from 'lucide-react'
import { useState } from 'react'

const metadataItems = [
  { key: 'provider', label: 'Organismo o area', icon: Building2 },
  { key: 'priorityAxis', label: 'Eje prioritario', icon: Milestone },
  { key: 'teachingHours', label: 'Horas catedra', icon: Clock },
  { key: 'modality', label: 'Modalidad', icon: Laptop },
  { key: 'certificationType', label: 'Certificacion', icon: Award },
]

function CourseMetadata({ course }) {
  return (
    <div className="course-metadata-grid">
      {metadataItems.map(({ key, label, icon: Icon }) => (
        <div className="metadata-item" key={key}>
          <Icon size={18} />
          <span>{label}</span>
          <strong>{course[key]}</strong>
        </div>
      ))}
    </div>
  )
}

export function CourseInfoCard({ schedule, onEnroll, enrolled = false }) {
  const [showSchedule, setShowSchedule] = useState(false)
  const formatShortDate = (date) => {
    const [day, month, year] = date.split('/')
    const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    return `${day} ${monthNames[Number(month) - 1]} ${year}`
  }

  const scheduleItems = [
    { label: 'Inicio', value: formatShortDate(schedule.startDate), icon: CalendarDays },
    { label: 'Finalizacion', value: formatShortDate(schedule.endDate), icon: CalendarDays },
    { label: 'Encuentros', value: schedule.meetings.replace('encuentros ', ''), icon: Milestone },
    { label: 'Lugar', value: schedule.place, icon: MapPin },
  ].filter((item) => item.value)

  return (
    <div className="course-enrollment-panel">
      <span className="status-pill">{schedule.enrollmentStatus}</span>
      <div className="schedule-inline-list">
        {scheduleItems.map(({ label, value, icon: Icon }) => (
          <div className="schedule-inline-item" key={label}>
            <Icon size={18} />
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="course-action-row">
        <button className="button" type="button" onClick={onEnroll}>
          {enrolled ? 'Continuar' : 'Inscribirme'} <ArrowRight size={17} />
        </button>
        <button className="button button-secondary" type="button" onClick={() => setShowSchedule((current) => !current)}>
          <Calendar size={17} /> Ver cronograma <ChevronDown className={showSchedule ? 'rotated' : ''} size={16} />
        </button>
      </div>
      {showSchedule && (
        <div className="course-schedule-details">
          <strong>Cronograma estimado</strong>
          <span>Semana 1: introduccion y competencias digitales</span>
          <span>Semana 2: herramientas colaborativas</span>
          <span>Semana 3: contenidos y evaluacion con tecnologia</span>
          <span>Semana 4: cierre, buenas practicas y actividad final</span>
        </div>
      )}
    </div>
  )
}

export default CourseMetadata
