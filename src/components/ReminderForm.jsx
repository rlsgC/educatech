import { X } from 'lucide-react'
import { useState } from 'react'
import { saveReminder } from '../data/dashboardState'

function ReminderForm({ reminder, activeCourses, selectedDate, onClose }) {
  const [form, setForm] = useState(() => reminder || { title: '', date: selectedDate, time: '', courseId: '' })
  const [error, setError] = useState('')
  const submit = event => {
    event.preventDefault()
    if (!form.title.trim() || !form.date) return setError('Completá el título y la fecha.')
    saveReminder({ ...form, title: form.title.trim() })
    onClose()
  }
  return (
    <div className="reminder-overlay" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="reminder-dialog" role="dialog" aria-modal="true" aria-labelledby="reminder-title">
        <button className="reminder-close" type="button" onClick={onClose} aria-label="Cerrar formulario"><X size={20} /></button>
        <h2 id="reminder-title">{reminder ? 'Editar recordatorio' : 'Agregar recordatorio'}</h2>
        <form onSubmit={submit}>
          <label>Título <input autoFocus value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} required /></label>
          <div className="reminder-form-row">
            <label>Fecha <input type="date" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} required /></label>
            <label>Hora <input type="time" value={form.time} onChange={event => setForm({ ...form, time: event.target.value })} /></label>
          </div>
          <label>Curso asociado<select value={form.courseId} onChange={event => setForm({ ...form, courseId: event.target.value })}><option value="">Sin curso asociado</option>{activeCourses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="reminder-form-actions"><button className="button button-secondary" type="button" onClick={onClose}>Cancelar</button><button className="button" type="submit">Guardar</button></div>
        </form>
      </section>
    </div>
  )
}

export default ReminderForm
