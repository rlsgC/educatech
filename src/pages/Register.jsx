import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, GraduationCap, Lock, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { emailExists, registerAccount, reloadAt } from '../data/account'
import { educationLevels, teachingAreas } from '../data/preferences'
import { WelcomePanel } from './Login'

const STEPS = ['Tus datos', 'Qué enseñás']
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

function passwordStrength(value) {
  const checks = [value.length >= 8, /\d/.test(value), value.length >= 12 || /[A-ZÑ]/.test(value) || /[^A-Za-z0-9ñÑ]/.test(value)]
  const score = value ? checks.filter(Boolean).length : 0
  return { score, label: ['', 'Débil', 'Buena', 'Muy buena'][score] }
}

function Stepper({ step }) {
  return (
    <ol className="rd-reg-steps" aria-label={`Paso ${step} de ${STEPS.length}`}>
      {STEPS.map((name, index) => {
        const number = index + 1
        const state = number < step ? 'done' : number === step ? 'now' : 'next'
        return (
          <li key={name} className={`is-${state}`} aria-current={state === 'now' ? 'step' : undefined}>
            <span className="rd-reg-dot" aria-hidden="true">{state === 'done' ? <Check size={15} strokeWidth={3} /> : number}</span>
            {name}
          </li>
        )
      })}
    </ol>
  )
}

function Field({ label, error, hint, id, children }) {
  return (
    <div className="rd-reg-field">
      <label className="rd-login-field" htmlFor={id}>
        <em className="rd-reg-label">{label}</em>
        <span className={error ? 'has-error' : ''}>{children}</span>
      </label>
      {hint && !error && <small className="rd-reg-hint" id={`${id}-hint`}>{hint}</small>}
      {error && <small className="rd-reg-error" id={`${id}-error`} role="alert">{error}</small>}
    </div>
  )
}

function Chips({ legend, options, value, onChange }) {
  const toggle = option => onChange(value.includes(option) ? value.filter(item => item !== option) : [...value, option])
  return (
    <fieldset className="rd-reg-chips">
      <legend>{legend}</legend>
      <div>
        {options.map(option => {
          const on = value.includes(option)
          return (
            <button key={option} type="button" aria-pressed={on} className={on ? 'is-on' : ''} onClick={() => toggle(option)}>
              {on && <Check size={15} strokeWidth={2.6} aria-hidden="true" />}{option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function Register() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState({ firstName: '', lastName: '', email: '', password: '', terms: false })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [levels, setLevels] = useState([])
  const [areas, setAreas] = useState([])
  const [institution, setInstitution] = useState('')
  const [busy, setBusy] = useState(false)
  const titleRef = useRef(null)
  const strength = passwordStrength(data.password)

  useEffect(() => { titleRef.current?.focus() }, [step])

  const update = field => event => {
    const value = field === 'terms' ? event.target.checked : event.target.value
    setData(current => ({ ...current, [field]: value }))
    setErrors(current => ({ ...current, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!data.firstName.trim()) next.firstName = 'Escribí tu nombre.'
    if (!data.lastName.trim()) next.lastName = 'Escribí tu apellido.'
    if (!validEmail(data.email)) next.email = 'Revisá el correo: tiene que ser como nombre@correo.com.'
    else if (emailExists(data.email)) next.email = 'exists'
    if (data.password.length < 8 || !/\d/.test(data.password)) next.password = 'Usá al menos 8 caracteres y un número.'
    if (!data.terms) next.terms = 'Para crear la cuenta tenés que aceptar los términos.'
    return next
  }

  const goToStep2 = event => {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      document.getElementById(`reg-${first}`)?.focus()
      return
    }
    setStep(2)
  }

  const finish = async (skip = false) => {
    setBusy(true)
    const result = await registerAccount({ ...data, institution: skip ? '' : institution })
    if (!result.ok) {
      setErrors({ email: 'exists' })
      setStep(1)
      setBusy(false)
      return
    }
    const chosen = skip ? { levels: [], areas: [] } : { levels, areas }
    const status = chosen.levels.length || chosen.areas.length ? 'completed' : 'omitted'
    window.localStorage.setItem(`educatech:preferences:${result.account.email}`, JSON.stringify({ status, ...chosen }))
    reloadAt('/')
  }

  const emailError = errors.email === 'exists'
    ? <>Ya hay una cuenta con este correo. <Link to="/login">Ingresá</Link></>
    : errors.email

  return (
    <main className="rd-login rd-reg">
      <WelcomePanel
        bubble={step === 1 ? '¡Bienvenida! En 2 pasos tenés tu cuenta lista.' : 'Contame qué enseñás y te recomiendo por dónde empezar.'}
        robot={step === 1 ? undefined : <Mascot state="piensa" className="rd-reg-bot" />}
      />

      <section className="rd-login-panel" aria-labelledby="reg-title">
        {step === 1 ? (
          <form className="rd-login-form" onSubmit={goToStep2} noValidate>
            <Stepper step={1} />
            <div className="rd-reg-head">
              <h1 id="reg-title" tabIndex={-1} ref={titleRef}>Creá tu cuenta</h1>
              <p className="rd-login-sub">Es gratis y te lleva un minuto.</p>
            </div>
            <div className="rd-reg-two">
              <Field label="Nombre" id="reg-firstName" error={errors.firstName}>
                <input id="reg-firstName" autoComplete="given-name" value={data.firstName} onChange={update('firstName')} aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? 'reg-firstName-error' : undefined} />
              </Field>
              <Field label="Apellido" id="reg-lastName" error={errors.lastName}>
                <input id="reg-lastName" autoComplete="family-name" value={data.lastName} onChange={update('lastName')} aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? 'reg-lastName-error' : undefined} />
              </Field>
            </div>
            <Field label="Correo electrónico" id="reg-email" error={emailError} hint="Lo vas a usar para ingresar.">
              <Mail size={18} aria-hidden="true" />
              <input id="reg-email" type="email" autoComplete="email" placeholder="nombre@correo.com" value={data.email} onChange={update('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'reg-email-error' : 'reg-email-hint'} />
            </Field>
            <Field label="Contraseña" id="reg-password" error={errors.password} hint="Mínimo 8 caracteres, con al menos un número.">
              <Lock size={18} aria-hidden="true" />
              <input id="reg-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={data.password} onChange={update('password')} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'reg-password-error' : 'reg-password-hint reg-strength'} />
              <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Field>
            {data.password && (
              <div className={`rd-reg-strength s${strength.score}`} id="reg-strength">
                <span aria-hidden="true"><i /><i /><i /></span>
                <small>Seguridad: {strength.label}</small>
              </div>
            )}
            <div className="rd-reg-field">
              <label className="rd-login-check rd-reg-terms">
                <input id="reg-terms" type="checkbox" checked={data.terms} onChange={update('terms')} aria-invalid={Boolean(errors.terms)} aria-describedby={errors.terms ? 'reg-terms-error' : undefined} />
                <span>Acepto los términos de uso y la política de privacidad.</span>
              </label>
              {errors.terms && <small className="rd-reg-error" id="reg-terms-error" role="alert">{errors.terms}</small>}
            </div>
            <button className="rd-btn rd-btn-primary rd-btn-lg rd-btn-block" type="submit">Continuar <ArrowRight size={18} /></button>
            <p className="rd-reg-switch">¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
          </form>
        ) : (
          <form className="rd-login-form" onSubmit={event => { event.preventDefault(); finish(false) }}>
            <Stepper step={2} />
            <div className="rd-reg-head">
              <h1 id="reg-title" tabIndex={-1} ref={titleRef}>¿Qué enseñás, {data.firstName.trim()}?</h1>
              <p className="rd-login-sub">Así te recomendamos cursos y recursos que te sirvan. Podés elegir varios.</p>
            </div>
            <Chips legend="Nivel" options={educationLevels} value={levels} onChange={setLevels} />
            <Chips legend="Área" options={teachingAreas} value={areas} onChange={setAreas} />
            <Field label={<>Escuela o institución <span className="rd-reg-optional">(opcional)</span></>} id="reg-institution">
              <GraduationCap size={18} aria-hidden="true" />
              <input id="reg-institution" autoComplete="organization" placeholder="Por ejemplo: Escuela Técnica N.° 1" value={institution} onChange={event => setInstitution(event.target.value)} />
            </Field>
            <div className="rd-reg-actions">
              <button className="rd-btn rd-btn-primary rd-btn-lg rd-btn-block" type="submit" disabled={busy}>{busy ? 'Creando tu cuenta…' : <>Crear mi cuenta <ArrowRight size={18} /></>}</button>
              <div>
                <button className="rd-login-linkbtn" type="button" onClick={() => setStep(1)} disabled={busy}><ArrowLeft size={16} /> Volver</button>
                <button className="rd-login-linkbtn is-muted" type="button" onClick={() => finish(true)} disabled={busy}>Omitir por ahora</button>
              </div>
            </div>
          </form>
        )}
      </section>
    </main>
  )
}

export default Register
