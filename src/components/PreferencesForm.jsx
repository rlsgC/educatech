import { Check, Search, X } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import TeacherMascot from './TeacherMascot'
import { educationLevels, teachingAreas } from '../data/preferences'

function ToggleOption({ value, selected, onToggle }) {
  return (
    <button className={`preference-option ${selected ? 'selected' : ''}`} type="button" aria-pressed={selected} onClick={() => onToggle(value)}>
      {selected && <Check size={17} aria-hidden="true" />}<span>{value}</span>
    </button>
  )
}

function PreferencesForm({ initialLevels = [], initialAreas = [], mode = 'onboarding', onSave, onSkip, onCancel }) {
  const [levels, setLevels] = useState(initialLevels)
  const [areas, setAreas] = useState(initialAreas)
  const [query, setQuery] = useState('')
  const dialogRef = useRef(null)
  const helpId = useId()
  const filteredAreas = useMemo(() => teachingAreas.filter(area => area.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))), [query])
  const toggle = (value, setter) => setter(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value])
  const valid = levels.length > 0 && areas.length > 0

  useEffect(() => {
    const previousFocus = document.activeElement
    dialogRef.current?.focus()
    return () => previousFocus?.focus?.()
  }, [])

  return (
    <div className="preferences-overlay" role="dialog" aria-modal="true" aria-labelledby="preferences-title">
      <section className="preferences-dialog" ref={dialogRef} tabIndex="-1" onKeyDown={event => { if (event.key === 'Escape' && mode === 'edit') onCancel() }}>
        <div className="preferences-main">
          {mode === 'edit' && <button className="preferences-close" type="button" onClick={onCancel} aria-label="Cancelar y cerrar"><X size={21} /></button>}
          <div className="preferences-heading">
            <span className="dashboard-eyebrow">Tu perfil docente</span>
            <h1 id="preferences-title">Personalizá tu experiencia</h1>
            <p>Contanos qué enseñás para recomendarte herramientas útiles para tus clases.</p>
          </div>
          <div className="preferences-group" role="group" aria-labelledby={`${helpId}-levels`}>
            <div><h2 id={`${helpId}-levels`}>¿En qué niveles enseñás?</h2><span>Podés elegir más de uno</span></div>
            <div className="preference-options">
              {educationLevels.map(level => <ToggleOption key={level} value={level} selected={levels.includes(level)} onToggle={value => toggle(value, setLevels)} />)}
            </div>
          </div>
          <div className="preferences-group" role="group" aria-labelledby={`${helpId}-areas`}>
            <div><h2 id={`${helpId}-areas`}>¿Qué áreas enseñás?</h2><span>Podés elegir más de uno</span></div>
            <label className="preference-search"><Search size={18} /><span className="sr-only">Buscar áreas</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar un área" type="search" /></label>
            <div className="preference-options">
              {filteredAreas.map(area => <ToggleOption key={area} value={area} selected={areas.includes(area)} onToggle={value => toggle(value, setAreas)} />)}
            </div>
            {filteredAreas.length === 0 && <p className="preference-no-results" role="status">No encontramos áreas que coincidan con tu búsqueda.</p>}
          </div>
          <div className="preferences-actions">
            <button className="button" type="button" disabled={!valid} aria-describedby={`${helpId}-required`} onClick={() => onSave(levels, areas)}>Guardar y continuar</button>
            {mode === 'onboarding' && <button className="preferences-skip" type="button" onClick={onSkip}>Completar después</button>}
            {mode === 'edit' && <button className="button button-secondary" type="button" onClick={onCancel}>Cancelar</button>}
          </div>
          <p className="preferences-required" id={`${helpId}-required`}>Seleccioná al menos un nivel y un área para guardar.</p>
        </div>
        <div className="preferences-visual">
          <TeacherMascot variant="welcome" size={390} alt="Ilustración de una docente sosteniendo cuadernos" />
        </div>
      </section>
    </div>
  )
}

export default PreferencesForm
