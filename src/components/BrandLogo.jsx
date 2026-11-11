// Logo de EducaTech basado en el robot creado por el equipo:
// casco blanco, visor oscuro, ojos sonrientes, mejillas y antena con luz ámbar.
export function RobotMark({ size = 44, animated = true, className = '' }) {
  return (
    <svg
      className={`robot-mark ${animated ? 'is-animated' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="EducaTech"
    >
      <rect width="64" height="64" rx="16" fill="#5B3FA3" />
      <g className="robot-mark-head">
        <line x1="32" y1="11.5" x2="32" y2="17.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        <circle className="robot-mark-light" cx="32" cy="9.5" r="3.4" fill="#F5B83D" />
        <rect x="9" y="30" width="5.5" height="11.5" rx="2.75" fill="#CFC3EA" />
        <rect x="49.5" y="30" width="5.5" height="11.5" rx="2.75" fill="#CFC3EA" />
        <ellipse cx="32" cy="36.5" rx="19.5" ry="17.5" fill="#fff" />
        <ellipse cx="32" cy="36.5" rx="14.5" ry="11.5" fill="#2A1F4D" />
        <circle cx="38.5" cy="30.5" r="1.6" fill="#fff" opacity=".85" />
        <g className="robot-mark-eyes">
          <path d="M23.6 38 q3.2 -5 6.4 0" fill="none" stroke="#B9A6F0" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M34 38 q3.2 -5 6.4 0" fill="none" stroke="#B9A6F0" strokeWidth="2.6" strokeLinecap="round" />
        </g>
        <circle cx="22.3" cy="42" r="1.8" fill="#E58FB7" opacity=".9" />
        <circle cx="41.7" cy="42" r="1.8" fill="#E58FB7" opacity=".9" />
      </g>
    </svg>
  )
}

function BrandLogo({ size = 44, tagline = 'Formación docente', animated = true }) {
  return (
    <div className="brand brand-robot">
      <RobotMark size={size} animated={animated} />
      <div>
        <strong className="brand-wordmark"><span>educa</span><span className="brand-wordmark-accent">tech</span></strong>
        {tagline && <span>{tagline}</span>}
      </div>
    </div>
  )
}

export default BrandLogo
