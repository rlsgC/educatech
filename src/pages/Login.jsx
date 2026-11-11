import { Eye, EyeOff, Lock, Mail, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { RobotBubble, RobotVideo } from '../components/RobotPortal'
import { enterDemo, loginAccount, reloadAt } from '../data/account'

// Panel de bienvenida compartido por el ingreso y la creación de cuenta.
export function WelcomePanel({ bubble = '¡Hola! Soy tu compañero en la formación digital. ¿Empezamos?', robot }) {
  return (
    <section className="rd-login-welcome" aria-label="Bienvenida">
      <span className="rd-login-deco d1" aria-hidden="true" />
      <span className="rd-login-deco d2" aria-hidden="true" />
      <span className="rd-login-deco d3" aria-hidden="true" />
      <span className="rd-login-deco d4" aria-hidden="true" />
      <BrandLogo size={52} tagline={null} />
      <div className="rd-login-robot">
        <RobotBubble>{bubble}</RobotBubble>
        {robot ?? <RobotVideo className="rd-robot-open" label="Mascota de educatech saludando" />}
      </div>
      <ul className="rd-login-chips" aria-label="Qué vas a encontrar">
        <li className="tone-violet">Cursos autogestionados</li>
        <li className="tone-green">Certificados</li>
        <li className="tone-amber">Logros y rachas</li>
      </ul>
    </section>
  )
}

const ERRORS = {
  'not-found': 'No encontramos una cuenta con ese correo.',
  'wrong-password': 'La contraseña no es correcta. Revisala y probá de nuevo.',
}

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [forgot, setForgot] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    const result = await loginAccount(email, password, remember)
    if (result.ok) {
      reloadAt('/')
      return
    }
    setError(result.error)
    setBusy(false)
  }

  const enterAsDemo = () => {
    enterDemo()
    reloadAt('/')
  }

  return (
    <main className="rd-login">
      <WelcomePanel />

      <section className="rd-login-panel" aria-labelledby="login-title">
        <form className="rd-login-form" onSubmit={handleSubmit} noValidate={false}>
          <span className="rd-login-kicker">Formación docente</span>
          <h1 id="login-title">Ingresá a tu cuenta</h1>
          <p className="rd-login-sub">Continuá aprendiendo donde lo dejaste.</p>
          <label className="rd-login-field">
            Correo electrónico
            <span>
              <Mail size={18} aria-hidden="true" />
              <input type="email" name="email" autoComplete="email" placeholder="nombre@correo.com" value={email} onChange={event => { setEmail(event.target.value); setError(null) }} aria-invalid={error === 'not-found'} aria-describedby={error ? 'login-error' : undefined} required />
            </span>
          </label>
          <label className="rd-login-field">
            Contraseña
            <span>
              <Lock size={18} aria-hidden="true" />
              <input type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" value={password} onChange={event => { setPassword(event.target.value); setError(null) }} aria-invalid={error === 'wrong-password'} aria-describedby={error ? 'login-error' : undefined} required />
              <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          {error && (
            <p className="rd-form-error" id="login-error" role="alert">
              {ERRORS[error]} {error === 'not-found' && <Link to="/registro">Crear una cuenta</Link>}
            </p>
          )}
          <div className="rd-login-row">
            <label className="rd-login-check">
              <input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} />
              Recordarme
            </label>
            <button className="rd-login-linkbtn" type="button" aria-expanded={forgot} onClick={() => setForgot(value => !value)}>¿Olvidaste tu contraseña?</button>
          </div>
          {forgot && (
            <p className="rd-form-note" role="status">
              En esta versión la cuenta se guarda solo en este navegador, así que todavía no podemos enviarte un correo para recuperarla. Podés crear una cuenta nueva o entrar con la cuenta de prueba.
            </p>
          )}
          <button className="rd-btn rd-btn-primary rd-btn-lg rd-btn-block" type="submit" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
          <div className="rd-login-divider" aria-hidden="true"><span>¿Es tu primera vez?</span></div>
          <Link className="rd-btn rd-btn-lg rd-btn-block rd-login-create" to="/registro"><Plus size={18} /> Crear mi cuenta</Link>
          <button className="rd-login-linkbtn rd-login-demo" type="button" onClick={enterAsDemo}>Entrar con la cuenta de prueba</button>
          <p className="rd-login-legal">Al ingresar aceptás los términos de uso y la política de privacidad.</p>
        </form>
      </section>
    </main>
  )
}

export default Login
