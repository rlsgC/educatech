import { Clock, Compass, HeartHandshake, Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import CourseCard from '../components/CourseCard'
import EmptyCourseOffer from '../components/EmptyCourseOffer'
import Mascot from '../components/Mascot'
import RobotPortal from '../components/RobotPortal'
import { courses } from '../data/courses'
import { useAvailableCourses } from '../data/courseState'
import { PUNTAJE_ESTADOS, coursePuntaje } from '../data/puntaje'
import { categoryLabel } from '../utils/learning'

const WITH_PUNTAJE = 'Con puntaje oficial'
const categories = ['Todos', ...new Set(courses.map(course => course.category))]
const LEGEND = [
  { key: 'con', icon: ShieldCheck },
  { key: 'tramite', icon: Clock },
  { key: 'sin', icon: HeartHandshake },
]

function Catalog() {
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [query, setQuery] = useState('')
  const availableCourses = useAvailableCourses(courses)
  const matches = (course, filter) => filter === 'Todos'
    || (filter === WITH_PUNTAJE ? coursePuntaje(course).estado === 'con' : course.category === filter)
  const searchedCourses = availableCourses.filter(course => `${course.title} ${course.description} ${course.category} ${categoryLabel(course.category)}`.toLowerCase().includes(query.trim().toLowerCase()))
  const filteredCourses = searchedCourses.filter(course => matches(course, activeFilter))
  const filterCount = filter => searchedCourses.filter(course => matches(course, filter)).length
  const filters = ['Todos', WITH_PUNTAJE, ...categories.slice(1)]

  return (
    <div className="rd-page">
      <section className="rd-catalog-hero" aria-labelledby="catalog-title">
        <RobotPortal size={150} className="rd-portal-catalog-v2" state="piensa" bubble="¿Te suma puntaje? Te lo marco en cada curso." />
        <div className="rd-catalog-hero-copy">
          <span className="rd-hero-eyebrow"><Compass size={14} /> Catálogo</span>
          <h1 id="catalog-title">Cursos cortos, útiles para tu aula</h1>
          <form className="rd-hero-search" role="search" onSubmit={event => event.preventDefault()}>
            <Search size={19} />
            <label className="sr-only" htmlFor="catalog-query">Buscar curso</label>
            <input id="catalog-query" value={query} onChange={event => setQuery(event.target.value)} placeholder="¿Qué querés aprender hoy?" />
            <button className="rd-btn rd-btn-primary" type="submit">Buscar</button>
          </form>
        </div>
        <div className="rd-catalog-legend" aria-label="¿Este curso me suma puntaje?">
          {LEGEND.map(({ key, icon: Icon }) => (
            <div key={key}>
              <span className={`rd-step-tile tone-${PUNTAJE_ESTADOS[key].tone} is-solid`} aria-hidden="true"><Icon size={18} /></span>
              <span><strong>{PUNTAJE_ESTADOS[key].label}</strong><small>{PUNTAJE_ESTADOS[key].help}</small></span>
            </div>
          ))}
        </div>
      </section>

      <div className="rd-filters" role="group" aria-label="Filtrar cursos">
        {filters.map(filter => (
          <button
            className={`${activeFilter === filter ? 'active' : ''} ${filter === WITH_PUNTAJE ? 'is-puntaje' : ''}`}
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === WITH_PUNTAJE && <ShieldCheck size={15} aria-hidden="true" />}
            {filter === WITH_PUNTAJE ? filter : categoryLabel(filter)} <span>{filterCount(filter)}</span>
          </button>
        ))}
      </div>

      <section className="rd-block" aria-labelledby="grid-title">
        <div className="rd-block-head">
          <div><h2 id="grid-title" className="sr-only">Cursos</h2><p className="rd-muted" role="status">{filteredCourses.length === 1 ? '1 curso disponible' : `${filteredCourses.length} cursos disponibles`}</p></div>
        </div>
        {availableCourses.length === 0 ? <EmptyCourseOffer /> : filteredCourses.length === 0 ? (
          <div className="rd-card rd-empty">
            <Mascot state="duda" once className="rd-empty-mascot" />
            <h3>{activeFilter === WITH_PUNTAJE ? 'Todavía no hay cursos con puntaje oficial' : 'No encontramos cursos'}</h3>
            <p>{activeFilter === WITH_PUNTAJE
              ? 'Cuando un curso obtenga aval oficial, va a aparecer acá. Mientras tanto, los cursos te sirven para tu aula y suman horas a tu carpeta.'
              : 'No hay cursos disponibles que coincidan con tu búsqueda y los filtros seleccionados.'}</p>
            <button className="rd-btn rd-btn-primary" type="button" onClick={() => { setQuery(''); setActiveFilter('Todos') }}>Ver todos los disponibles</button>
          </div>
        ) : (
          <div className="rd-catalog-grid">
            {filteredCourses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </section>
    </div>
  )
}

export default Catalog
