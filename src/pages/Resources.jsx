import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, Download, ExternalLink, FileText, Folder, Info, LayoutTemplate, Link2, Play, Search, Sparkles, Wrench, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Mascot from '../components/Mascot'
import RobotPortal, { RobotBubble } from '../components/RobotPortal'
import TeachingToolCard from '../components/TeachingToolCard'
import ToolGuide from '../components/ToolGuide'
import { courses } from '../data/courses'
import { isCourseFinished, useEnrolledCourses } from '../data/courseState'
import { recordActivity, useActivities } from '../data/dashboardState'
import { usePreferences } from '../data/preferences'
import { resources } from '../data/resources'
import { recommendTools, teachingTools } from '../data/teachingTools'
import { recordResourceDownload } from '../utils/activityLog'
import { getCourseFolders } from '../utils/courseMaterials'
import { courseIcons } from '../utils/courseIcons'
import { courseTone, getNextStep } from '../utils/learning'
import { withAccents } from '../utils/session'

const typeInfo = {
  Guias: { label: 'Guía', plural: 'Guías', icon: FileText, tone: 'amber' },
  Plantillas: { label: 'Plantilla', plural: 'Plantillas', icon: LayoutTemplate, tone: 'green' },
  Articulos: { label: 'Artículo', plural: 'Artículos', icon: BookOpen, tone: 'violet' },
  Videos: { label: 'Video', plural: 'Videos', icon: Play, tone: 'blue' },
  Enlaces: { label: 'Enlace', plural: 'Enlaces', icon: Link2, tone: 'teal' },
}
const filters = ['Todos', ...Object.keys(typeInfo)]
const folders = getCourseFolders()
const totalVideos = folders.reduce((total, folder) => total + folder.videos, 0)
const totalFiles = folders.reduce((total, folder) => total + folder.files, 0)
const shortDuration = value => {
  const match = String(value).match(/(\d+)\s*min(?:\s*(\d+)\s*s)?/)
  return match ? `${match[1]}:${String(match[2] ?? 0).padStart(2, '0')}` : value
}

const cleanTitle = title => String(title).replace(/\.[a-z0-9]+$/i, '').replace(/^(Video|Sitio recomendado|Articulo):\s*/i, '')
const formatOf = resource => {
  const extension = String(resource.title).match(/\.([a-z0-9]+)$/i)?.[1]
  if (extension) return extension.toUpperCase()
  return typeInfo[resource.type]?.label ?? 'Recurso'
}
const plain = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const matches = (text, query) => plain(text).includes(plain(query.trim()))

function relativeTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const minutes = Math.round((date.getTime() - Date.now()) / 60000)
  const formatter = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' })
  if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  return Math.abs(hours) < 24 ? formatter.format(hours, 'hour') : formatter.format(Math.round(hours / 24), 'day')
}

function VideoDialog({ material, onClose }) {
  useEffect(() => {
    const onKey = event => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="reminder-overlay" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className="rd-video-dialog" role="dialog" aria-modal="true" aria-labelledby="video-title">
        <div className="rd-cert-dialog-head">
          <div><strong id="video-title">{material.title}</strong><span className="rd-muted">{material.where}</span></div>
          <button className="rd-icon-btn rd-icon-btn-lg" type="button" onClick={onClose} aria-label="Cerrar video" autoFocus><X size={18} /></button>
        </div>
        <video className="rd-video" src={material.src} poster={material.poster} controls autoPlay preload="metadata" />
        {material.objective && <p className="rd-video-objective"><strong>Objetivo:</strong> {material.objective}</p>}
        <div className="rd-cert-dialog-actions">
          <Link className="rd-btn rd-btn-ghost" to={`/cursos/${material.course.id}/aprender`}>Ir a la lección</Link>
          <button className="rd-btn rd-btn-primary" type="button" onClick={onClose}>Cerrar</button>
        </div>
      </section>
    </div>
  )
}

const STATUS = { active: 'Cursando', done: 'Terminado' }

function folderStatus(course, enrolledIds) {
  if (isCourseFinished(course)) return 'done'
  return enrolledIds.has(course.id) ? 'active' : null
}

function LessonRow({ lesson, course, path, onPlay }) {
  const download = file => recordActivity({
    id: `resource:file:${course.id}:${lesson.id}:${file.href}`,
    type: 'resource',
    title: 'Descargaste un recurso',
    detail: file.title,
    courseId: course.id,
  })
  const label = file => (lesson.files.length > 1 ? `${file.title} (${file.format})` : `Guía ${file.format}`)
  return (
    <div className="rd-rf-lesson">
      {lesson.number && <span className="rd-rf-num" aria-hidden="true">{lesson.number}</span>}
      <div className="rd-rf-lesson-copy">
        <strong>{lesson.title}</strong>
        {path && <span>{path}</span>}
      </div>
      <div className="rd-rf-lesson-actions">
        {lesson.video && (
          <button className="rd-btn rd-btn-dark rd-rf-btn" type="button" onClick={() => onPlay(lesson, course)} aria-label={`Ver video: ${lesson.title}`}>
            <Play size={15} /> <span className="rd-rf-time">{lesson.video.duration ? `Ver video · ${shortDuration(lesson.video.duration)}` : 'Ver video'}</span>
          </button>
        )}
        {lesson.files.map(file => (
          <a key={file.href} className="rd-btn rd-rf-btn rd-rf-btn-soft" href={file.href} download={file.fileName} onClick={() => download(file)} aria-label={`Descargar ${file.title}`}>
            <Download size={15} /> {label(file)}
          </a>
        ))}
      </div>
    </div>
  )
}

function FolderCard({ folder, status }) {
  const [Icon] = courseIcons[folder.course.id] ?? [FileText]
  const title = withAccents(folder.course.title)
  return (
    <Link className={`rd-rf-folder tone-${courseTone(folder.course)}`} to={`?carpeta=${folder.course.id}`} aria-label={`Abrir la carpeta ${title}: ${folder.videos} videos y ${folder.files} guías`}>
      <span className="rd-rf-folder-top">
        <span className="rd-rf-folder-icon" aria-hidden="true"><Icon size={21} strokeWidth={1.9} /></span>
        {status && <span className={`rd-rf-status is-${status}`}>{STATUS[status]}</span>}
      </span>
      <strong>{title}</strong>
      <span className="rd-rf-counts">
        <span><Play size={14} /> {folder.videos} {folder.videos === 1 ? 'video' : 'videos'}</span>
        <span><FileText size={14} /> {folder.files} {folder.files === 1 ? 'guía' : 'guías'}</span>
      </span>
      <span className="rd-rf-folder-foot">{folder.modules.length} {folder.modules.length === 1 ? 'módulo' : 'módulos'} <ArrowRight size={17} /></span>
    </Link>
  )
}

function FolderView({ folder, status, onPlay, onBack }) {
  const [open, setOpen] = useState(() => new Set([folder.modules[0]?.id]))
  const { course } = folder
  const [Icon] = courseIcons[course.id] ?? [FileText]
  const title = withAccents(course.title)
  const toggle = id => setOpen(current => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
  const jump = id => {
    setOpen(current => new Set(current).add(id))
    window.requestAnimationFrame(() => document.getElementById(`modulo-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  return (
    <div className="rd-page rd-rf">
      <nav className="rd-cd-nav" aria-label="Ubicación">
        <button className="rd-cd-back" type="button" onClick={onBack}><ArrowLeft size={18} /> Volver</button>
        <ol className="rd-cd-crumbs">
          <li><Link to="/recursos">Recursos</Link></li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>

      <section className={`rd-rf-hero tone-${courseTone(course)}`} aria-labelledby="folder-title">
        <div className="rd-rf-hero-copy">
          <span className="rd-rf-hero-top">
            <span className="rd-rf-folder-icon rd-rf-folder-icon-lg" aria-hidden="true"><Icon size={24} strokeWidth={1.9} /></span>
            {status && <span className={`rd-rf-status is-${status}`}>{STATUS[status]}</span>}
          </span>
          <h1 id="folder-title">{title}</h1>
          <div className="rd-cd-chips">
            <span><Folder size={15} /> {folder.modules.length} {folder.modules.length === 1 ? 'módulo' : 'módulos'}</span>
            <span><Play size={15} /> {folder.videos} videos</span>
            <span><FileText size={15} /> {folder.files} guías en PDF</span>
          </div>
          <div className="rd-cd-cta">
            <Link className="rd-btn rd-btn-primary" to={status ? `/cursos/${course.id}/aprender` : `/cursos/${course.id}`}>{status ? 'Ir al curso' : 'Ver el curso'} <ArrowRight size={18} /></Link>
          </div>
        </div>
        <div className="rd-cd-robot rd-rf-robot">
          <RobotBubble>Cada lección tiene su video y su guía, uno al lado del otro.</RobotBubble>
          <Mascot state="estudia" className="rd-cd-bot rd-rf-bot" />
        </div>
      </section>

      <div className="rd-rf-grid">
        <div className="rd-rf-modules">
          {folder.modules.map(module => {
            const isOpen = open.has(module.id)
            const videos = module.lessons.filter(lesson => lesson.video).length
            const files = module.lessons.reduce((total, lesson) => total + lesson.files.length, 0)
            return (
              <section key={module.id} id={`modulo-${module.id}`} className={`rd-card rd-rf-module ${isOpen ? 'is-open' : ''}`}>
                <h2>
                  <button type="button" className="rd-rf-module-head" aria-expanded={isOpen} aria-controls={`contenido-${module.id}`} onClick={() => toggle(module.id)}>
                    <span className="rd-rf-module-num" aria-hidden="true">{module.number}</span>
                    <span className="rd-rf-module-title"><small>Módulo {module.number}</small>{module.name}</span>
                    <span className="rd-rf-module-count">{videos} {videos === 1 ? 'video' : 'videos'} · {files} {files === 1 ? 'guía' : 'guías'}</span>
                    <ChevronDown className="rd-rf-chev" size={20} aria-hidden="true" />
                  </button>
                </h2>
                {isOpen && (
                  <div id={`contenido-${module.id}`} className="rd-rf-lessons">
                    {module.lessons.map(lesson => <LessonRow key={lesson.id} lesson={lesson} course={course} onPlay={onPlay} />)}
                  </div>
                )}
              </section>
            )
          })}
        </div>
        <aside className="rd-card rd-rf-index" aria-label="Módulos de esta carpeta">
          <h2>En esta carpeta</h2>
          {folder.modules.map(module => (
            <button key={module.id} type="button" className={open.has(module.id) ? 'is-open' : ''} onClick={() => jump(module.id)}>
              <span aria-hidden="true">{module.number}</span>{module.name}
            </button>
          ))}
          <p className="rd-rf-note"><Info size={17} aria-hidden="true" /><span>Mirar un video acá no cambia tu avance del curso. Para avanzar, entrá desde “{status ? 'Ir al curso' : 'Ver el curso'}”.</span></p>
        </aside>
      </div>
    </div>
  )
}

function SearchResults({ folders, query, onPlay }) {
  const results = folders.flatMap(folder => folder.modules.flatMap(module => module.lessons
    .filter(lesson => matches(`${lesson.title} ${lesson.video?.title ?? ''} ${lesson.files.map(file => file.title).join(' ')} ${module.name} ${withAccents(folder.course.title)}`, query))
    .map(lesson => ({ lesson, course: folder.course, path: `${withAccents(folder.course.title)} › Módulo ${module.number}: ${module.name}` }))))
  if (!results.length) return <p className="rd-muted">Ningún video ni guía coincide con “{query}”.</p>
  return (
    <div className="rd-card rd-rf-results">
      <p className="rd-rf-results-count" role="status">{results.length} {results.length === 1 ? 'lección encontrada' : 'lecciones encontradas'}</p>
      {results.map(item => <LessonRow key={`${item.course.id}:${item.lesson.id}`} {...item} onPlay={onPlay} />)}
    </div>
  )
}

function LibraryRow({ resource }) {
  const info = typeInfo[resource.type] ?? typeInfo.Guias
  const Icon = info.icon
  const course = courses.find(item => item.id === resource.courseId)
  return (
    <div className="rd-library-row">
      <span className={`rd-icon-tile tone-${info.tone}`}><Icon size={18} /></span>
      <div className="rd-library-copy">
        <strong>{cleanTitle(resource.title)}</strong>
        <span>{info.label} · {formatOf(resource)}{course ? ` · ${course.title}` : ''}</span>
      </div>
      {resource.href
        ? <a className="rd-btn rd-btn-soft rd-btn-sm" href={resource.href} download onClick={() => recordResourceDownload(resource)} aria-label={`Descargar ${cleanTitle(resource.title)}`}><Download size={15} /> Descargar</a>
        : <span className="rd-soon">Próximamente</span>}
    </div>
  )
}

function RecentDownloads() {
  const downloads = useActivities()
    .filter(item => item.type === 'resource')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
  return (
    <section className="rd-card rd-side-card" aria-labelledby="recent-title">
      <h2 id="recent-title">Descargados recientemente</h2>
      {downloads.length ? (
        <ul className="rd-recent">
          {downloads.map(item => (
            <li key={item.id}><span className="rd-icon-tile tone-teal"><Download size={17} /></span><div><strong>{item.detail}</strong><span>{relativeTime(item.date)}</span></div></li>
          ))}
        </ul>
      ) : <p className="rd-muted rd-empty-note">Todavía no descargaste recursos. Los que bajes van a aparecer acá.</p>}
      <p className="rd-side-note">Cada descarga suma +5 chispas.</p>
    </section>
  )
}

function PreferencesCard({ preferences }) {
  const completed = preferences.status === 'completed'
  return (
    <section className="rd-card rd-side-card" aria-labelledby="pref-title">
      <h2 id="pref-title">Tus preferencias</h2>
      {completed ? (
        <div className="rd-pref-chips">{[...preferences.levels, ...preferences.areas].map(item => <span key={item}>{item}</span>)}</div>
      ) : <p className="rd-muted rd-empty-note">Todavía no indicaste qué nivel y área enseñás.</p>}
      <Link className="rd-link rd-side-more" to="/perfil">{completed ? 'Editar en mi perfil' : 'Completar en mi perfil'} <ArrowRight size={16} /></Link>
    </section>
  )
}

function Resources() {
  const [filter, setFilter] = useState('Todos')
  const [query, setQuery] = useState('')
  const [playing, setPlaying] = useState(null)
  const [selectedTool, setSelectedTool] = useState(null)
  const [params, setParams] = useSearchParams()
  const preferences = usePreferences()
  const enrolled = useEnrolledCourses(courses)
  const activities = useActivities()
  const nextStep = getNextStep(enrolled.filter(course => !isCourseFinished(course)))
  const enrolledIds = new Set(enrolled.map(course => course.id))
  const statusOf = course => folderStatus(course, enrolledIds)
  const openFolder = folders.find(folder => folder.course.id === params.get('carpeta'))
  const myFolders = folders.filter(folder => statusOf(folder.course))
  const otherFolders = folders.filter(folder => !statusOf(folder.course))
  const play = (lesson, course) => setPlaying({
    title: lesson.video.title || lesson.title,
    where: `${withAccents(course.title)}${lesson.number ? ` · Lección ${lesson.number}` : ''}`,
    src: lesson.video.src,
    poster: lesson.video.poster,
    objective: lesson.video.objective,
    course,
  })

  useEffect(() => { window.scrollTo({ top: 0 }) }, [openFolder?.course.id])

  if (openFolder) {
    return (
      <>
        <FolderView key={openFolder.course.id} folder={openFolder} status={statusOf(openFolder.course)} onPlay={play} onBack={() => setParams({})} />
        {playing && <VideoDialog material={playing} onClose={() => setPlaying(null)} />}
      </>
    )
  }

  const searched = resources.filter(resource => matches(`${resource.title} ${typeInfo[resource.type]?.plural ?? ''}`, query))
  const list = searched.filter(resource => filter === 'Todos' || resource.type === filter)
  const count = item => searched.filter(resource => item === 'Todos' || resource.type === item).length
  const featured = resources.find(resource => resource.href && resource.courseId === nextStep?.course.id) ?? resources.find(resource => resource.href)
  const featuredCourse = courses.find(course => course.id === featured?.courseId)
  const downloadsCount = new Set(activities.filter(item => item.type === 'resource').map(item => item.id)).size
  const recommended = recommendTools(preferences)
  const tools = recommended.length ? recommended : teachingTools

  return (
    <div className="rd-page">
      <div className="rd-page-head">
        <div>
          <span className="rd-kicker">Tu biblioteca</span>
          <h1>Recursos</h1>
          <p>Los videos y guías de cada curso, ordenados en carpetas.</p>
        </div>
        <label className="rd-search">
          <Search size={18} />
          <span className="sr-only">Buscar en todas las carpetas</span>
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar en todas las carpetas…" />
        </label>
      </div>

      {featured && (
        <section className="rd-hero rd-hero-resources" aria-labelledby="featured-resource-title">
          <RobotPortal size={190} className="rd-portal-resources" state="estudia">
            <span className="rd-file-chip tone-rose c1" aria-hidden="true">PDF</span>
            <span className="rd-file-chip tone-blue c2" aria-hidden="true">VIDEO</span>
            <span className="rd-file-chip tone-amber c3" aria-hidden="true">GUÍA</span>
          </RobotPortal>
          <div className="rd-hero-copy">
            <span className="rd-hero-eyebrow"><Sparkles size={14} /> {featuredCourse && nextStep?.course.id === featuredCourse.id ? 'Para tu curso actual' : 'Recurso destacado'}</span>
            <h2 id="featured-resource-title">{cleanTitle(featured.title)}</h2>
            <p>{featuredCourse ? `Complementa ${featuredCourse.title}. Descargala y usala al planificar tus clases.` : 'Un material listo para usar en tus clases.'}</p>
            <div className="rd-hero-actions">
              <a className="rd-btn rd-btn-amber" href={featured.href} download onClick={() => recordResourceDownload(featured)}><Download size={17} /> Descargar guía</a>
              {featuredCourse && <Link className="rd-btn rd-btn-glass" to={`/cursos/${featuredCourse.id}/aprender`}>Ir al curso</Link>}
            </div>
            <div className="rd-hero-stats">
              <span><strong>{folders.length}</strong> carpetas de cursos</span>
              <span><strong>{totalVideos}</strong> videos</span>
              <span><strong>{totalFiles}</strong> guías en PDF</span>
              <span><strong>{resources.length}</strong> recursos en la biblioteca</span>
              <span><strong>{downloadsCount}</strong> {downloadsCount === 1 ? 'descargado' : 'descargados'}</span>
            </div>
          </div>
        </section>
      )}

      {query.trim() ? (
        <section className="rd-block" aria-labelledby="materials-title">
          <div className="rd-block-head">
            <div><span className="rd-eyebrow">Material de tus cursos</span><h2 id="materials-title">Resultados en todas las carpetas</h2></div>
          </div>
          <SearchResults folders={folders} query={query} onPlay={play} />
        </section>
      ) : (
        <>
          {myFolders.length > 0 && (
            <section className="rd-block" aria-labelledby="my-folders-title">
              <div className="rd-block-head">
                <div><span className="rd-eyebrow">Material de tus cursos</span><h2 id="my-folders-title">Tus cursos</h2><p className="rd-muted">Abrí una carpeta para ver sus módulos, con el video y la guía de cada lección.</p></div>
              </div>
              <div className="rd-rf-folders">{myFolders.map(folder => <FolderCard key={folder.course.id} folder={folder} status={statusOf(folder.course)} />)}</div>
            </section>
          )}
          {otherFolders.length > 0 && (
            <section className="rd-block" aria-labelledby="other-folders-title">
              <div className="rd-block-head">
                <div><span className="rd-eyebrow">Del catálogo</span><h2 id="other-folders-title">{myFolders.length ? 'Otros cursos' : 'Cursos'}</h2><p className="rd-muted">También podés mirar el material de los cursos en los que todavía no te inscribiste.</p></div>
              </div>
              <div className="rd-rf-folders">{otherFolders.map(folder => <FolderCard key={folder.course.id} folder={folder} status={null} />)}</div>
            </section>
          )}
        </>
      )}

      <div className="rd-layout">
        <section className="rd-main-col" aria-labelledby="library-title">
          <div className="rd-block-head rd-block-head-tight">
            <div><span className="rd-eyebrow">Biblioteca</span><h2 id="library-title">Recursos para tu práctica</h2></div>
          </div>
          <div className="rd-filters" role="group" aria-label="Filtrar por tipo">
            {filters.map(item => (
              <button key={item} type="button" className={filter === item ? 'active' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)} disabled={count(item) === 0 && filter !== item}>
                {item === 'Todos' ? 'Todos' : typeInfo[item].plural} <span>{count(item)}</span>
              </button>
            ))}
          </div>
          {list.length ? (
            <div className="rd-card rd-library">{list.map(resource => <LibraryRow key={resource.id} resource={resource} />)}</div>
          ) : (
            <div className="rd-card rd-empty">
              <Mascot state="duda" once className="rd-empty-mascot" />
              <h3>No encontramos recursos</h3>
              <p>Probá con otra palabra o mirá todos los recursos.</p>
              <button className="rd-btn rd-btn-primary" type="button" onClick={() => { setQuery(''); setFilter('Todos') }}>Ver todos</button>
            </div>
          )}
          {tools.length > 0 && (
            <section className="rd-block" aria-labelledby="tools-grid-title">
              <div className="rd-block-head rd-block-head-tight"><div><span className="rd-eyebrow">{recommended.length ? 'Recomendadas para vos' : 'Catálogo'}</span><h2 id="tools-grid-title">Herramientas para el aula</h2></div></div>
              <div className="tools-grid">{tools.map(tool => <TeachingToolCard key={tool.id} tool={tool} onOpen={setSelectedTool} />)}</div>
            </section>
          )}
        </section>

        <aside className="rd-side-col" aria-label="Tu actividad con recursos">
          <RecentDownloads />
          {tools.length === 0 && (
            <section className="rd-promo" aria-labelledby="tools-title">
              <span className="rd-promo-icon"><Wrench size={20} /></span>
              <div>
                <h2 id="tools-title">Herramientas para el aula</h2>
                <p>Estamos verificando guías de herramientas. Contanos qué nivel y área enseñás para recomendarte las que te sirvan.</p>
              </div>
              <Link className="rd-link rd-link-dark" to="/perfil">{preferences.status === 'completed' ? 'Revisar mis preferencias' : 'Completar mis preferencias'} <ExternalLink size={15} /></Link>
            </section>
          )}
          <PreferencesCard preferences={preferences} />
        </aside>
      </div>

      {playing && <VideoDialog material={playing} onClose={() => setPlaying(null)} />}
      <ToolGuide tool={selectedTool} onClose={() => setSelectedTool(null)} />
    </div>
  )
}

export default Resources
