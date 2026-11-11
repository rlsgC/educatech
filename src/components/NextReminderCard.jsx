import { CalendarDays, Clock } from 'lucide-react'
import { courses } from '../data/courses'
import { useReminders } from '../data/dashboardState'
import { getUpcomingReminder, relativeDay } from '../utils/learning'

function NextReminderCard({ title = 'Próximo recordatorio' }) {
  const reminder = getUpcomingReminder(useReminders())
  const course = reminder?.courseId ? courses.find(item => item.id === reminder.courseId) : null
  return (
    <section className="rd-card rd-side-card" aria-labelledby="next-reminder-title">
      <h2 id="next-reminder-title">{title}</h2>
      {reminder ? (
        <div className="rd-reminder">
          <span className="rd-icon-tile tone-violet-solid"><CalendarDays size={19} /></span>
          <div>
            <div className="rd-reminder-top"><strong>{reminder.title}</strong><span>{relativeDay(reminder.date)}</span></div>
            <span className="rd-muted"><Clock size={13} /> {reminder.time || 'Sin hora'}{course ? ` · ${course.title}` : ''}</span>
          </div>
        </div>
      ) : (
        <p className="rd-muted rd-empty-note">No tenés recordatorios próximos. Agregá uno desde el calendario de Inicio.</p>
      )}
    </section>
  )
}

export default NextReminderCard
