import robotPoster from '../assets/mascot/robot-saludo.webp'
import robotVideo from '../assets/mascot/robot-saludo.mp4'
import { useReducedMotion } from '../utils/useMotion'
import Mascot from './Mascot'

// Video del robot de educatech. El video tiene fondo lavanda (#EFE7F8),
// por eso se muestra sobre superficies lavanda o dentro de un círculo ("portal").
export function RobotVideo({ className = '', label }) {
  const reduced = useReducedMotion()
  const a11y = label ? { 'aria-label': label } : { 'aria-hidden': true }
  return (
    <video
      className={`rd-robot-video ${className}`}
      src={robotVideo}
      poster={robotPoster}
      autoPlay={!reduced}
      loop
      muted
      playsInline
      preload="metadata"
      {...a11y}
    />
  )
}

// Globo de diálogo del robot.
export function RobotBubble({ children, className = '' }) {
  return <p className={`rd-robot-bubble ${className}`}>{children}</p>
}

// Robot dentro de un círculo lavanda, para usar sobre los banners oscuros.
function RobotPortal({ size = 210, bubble, state = 'saludo', once = false, className = '', children }) {
  return (
    <div className={`rd-robot-portal ${className}`} style={{ '--portal': `${size}px` }}>
      {children}
      <span className="rd-robot-portal-circle"><Mascot state={state} once={once} decorative /></span>
      {bubble && <RobotBubble>{bubble}</RobotBubble>}
    </div>
  )
}

export default RobotPortal
