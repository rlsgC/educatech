import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLogo from '../components/BrandLogo'
import { RobotBubble, RobotVideo } from '../components/RobotPortal'

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/')
  }

  return (
    <main className="rd-login">
      <section className="rd-login-welcome" aria-label="Bienvenida">
        <span className="rd-login-deco d1" aria-hidden="true" />
        <span className="rd-login-deco d2" aria-hidden="true" />
        <span className="rd-login-deco d3" aria-hidden="true" />
        <span className="rd-login-deco d4" aria-hidden="true" />
        <BrandLogo size={52} tagline={null} />
        <div className="rd-login-robot">
          <RobotBubble>¡Hola! Soy tu compañero en la formación digital. ¿Empezamos?</RobotBubble>
          <RobotVideo className="rd-robot-open" label="Mascota de educatech saludando" />
        </div>
        <ul className="rd-login-chips" aria-label="Qué vas a encontrar">
          <li className="tone-violet">Cursos autogestionados</li>
          <li className="tone-green">Certificados</li>
          <li className="tone-amber">Logros y rachas</li>
        </ul>
      </section>

      <section className="rd-login-panel" aria-labelledby="login-title">
        <form className="rd-login-form" onSubmit={handleSubmit}>
          <span className="rd-login-kicker">Formación docente</span>
          <h1 id="login-title">Ingresá a tu cuenta</h1>
          <p className="rd-login-sub">Continuá aprendiendo donde lo dejaste.</p>
          <label className="rd-login-field">
            Correo electrónico
            <span>
              <Mail size={18} aria-hidden="true" />
              <input type="email" name="email" autoComplete="email" placeholder="nombre@institucion.edu.ar" defaultValue="maria.gonzalez@institucion.edu.ar" required />
            </span>
          </label>
          <label className="rd-login-field">
            Contraseña
            <span>
              <Lock size={18} aria-hidden="true" />
              <input type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" defaultValue="educatech" required />
              <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          <div className="rd-login-row">
            <label className="rd-login-check">
              <input type="checkbox" defaultChecked />
              Recordarme
            </label>
            <a href="#recuperar">¿Olvidaste tu contraseña?</a>
          </div>
          <button className="rd-btn rd-btn-primary rd-btn-lg rd-btn-block" type="submit">Ingresar</button>
          <p className="rd-login-legal">Al ingresar aceptás los términos de uso y la política de privacidad.</p>
        </form>
      </section>
    </main>
  )
}

export default Login
