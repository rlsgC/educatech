import { useId } from 'react'
import '../styles/mascot.css'

// Mascota vectorial de educatech (el mismo robot del video, redibujado en SVG).
// Estados: saludo · estudia · piensa · celebra · duerme · duda.
// `once`: las animaciones de acción (celebrar, dudar) se reproducen una sola vez.

const STAR = 'l3.6 7.4 8.1 1.2 -5.9 5.7 1.4 8.1 -7.2 -3.8 -7.2 3.8 1.4 -8.1 -5.9 -5.7 8.1 -1.2z'

const LABELS = {
  saludo: 'Mascota de educatech saludando',
  estudia: 'Mascota de educatech estudiando',
  piensa: 'Mascota de educatech pensando',
  celebra: 'Mascota de educatech celebrando',
  duerme: 'Mascota de educatech durmiendo',
  duda: 'Mascota de educatech confundida',
}

const EYES = { saludo: 'happy', estudia: 'open', piensa: 'open', celebra: 'star', duerme: 'closed', duda: 'open' }

function Eyes({ kind }) {
  if (kind === 'happy') {
    return <g className="eyes blink"><path d="M92 118 q10 -14 20 0" /><path d="M128 118 q10 -14 20 0" /></g>
  }
  if (kind === 'closed') {
    return <g className="eyes"><path d="M92 114 q10 9 20 0" /><path d="M128 114 q10 9 20 0" /></g>
  }
  if (kind === 'star') {
    return <g className="eyes-star"><path d={`M102 101 ${STAR}`} /><path d={`M138 101 ${STAR}`} /></g>
  }
  return (
    <g className="eyes-open blink">
      <g className="pupils">
        <ellipse cx="102" cy="113" rx="6.5" ry="8.5" /><ellipse cx="138" cy="113" rx="6.5" ry="8.5" />
        <circle className="glint" cx="104.5" cy="109.5" r="2" /><circle className="glint" cx="140.5" cy="109.5" r="2" />
      </g>
    </g>
  )
}

const CONFETTI = [
  ['c1', '#F5B83D', 52, 70, 8, 12], ['c2', '#B9A6F0', 186, 64, 7, 11], ['c3', '#E58FB7', 36, 128, 9, 9], ['c4', '#7BC4A8', 204, 122, 8, 12],
  ['c5', '#5B3FA3', 70, 30, 6, 10], ['c6', '#F5B83D', 168, 24, 7, 7], ['c7', '#7BC4A8', 30, 190, 6, 10], ['c8', '#E58FB7', 212, 186, 7, 11],
]

function BackProps({ state }) {
  if (state === 'piensa') {
    return <g className="thought"><circle className="td td1" cx="186" cy="44" r="5" /><circle className="td td2" cx="200" cy="28" r="7.5" /><circle className="td td3" cx="219" cy="10" r="10" /></g>
  }
  if (state === 'duerme') {
    return <g className="zzz"><text className="z z1" x="178" y="58">z</text><text className="z z2" x="192" y="42">z</text><text className="z z3" x="208" y="24">Z</text></g>
  }
  if (state === 'duda') return <g className="question"><text x="186" y="60">?</text></g>
  if (state === 'celebra') {
    return (
      <g className="confetti">
        {CONFETTI.map(([id, fill, x, y, width, height]) => <rect key={id} className={`cf ${id}`} x={x} y={y} width={width} height={height} rx="2" fill={fill} />)}
      </g>
    )
  }
  return null
}

function Tablet() {
  return (
    <g className="tablet">
      <rect x="93" y="178" width="54" height="62" rx="8" fill="#5B3FA3" />
      <rect x="98" y="183" width="44" height="52" rx="4" fill="#fff" />
      <rect className="tl tl1" x="104" y="192" width="32" height="4" rx="2" fill="#CDBDEB" />
      <rect className="tl tl2" x="104" y="201" width="26" height="4" rx="2" fill="#CDBDEB" />
      <rect className="tl tl3" x="104" y="210" width="30" height="4" rx="2" fill="#CDBDEB" />
      <path d="M108 225 q4.5 -6 9 0 M123 225 q4.5 -6 9 0" stroke="#E58FB7" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Mascot({ state = 'saludo', once = false, onDark = false, label, decorative = false, className = '' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const a11y = decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label ?? LABELS[state] }
  const classes = ['mascot', `st-${state}`, once && 'is-once', onDark && 'on-dark', className].filter(Boolean).join(' ')

  return (
    <svg className={classes} viewBox="0 0 240 260" {...a11y}>
      <defs>
        <radialGradient id={`h${id}`} cx="38%" cy="28%" r="80%"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".62" stopColor="#F6F1FD" /><stop offset="1" stopColor="#DCCDF4" /></radialGradient>
        <radialGradient id={`b${id}`} cx="40%" cy="30%" r="85%"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".7" stopColor="#F1EAFB" /><stop offset="1" stopColor="#D6C6F1" /></radialGradient>
        <radialGradient id={`v${id}`} cx="45%" cy="30%" r="80%"><stop offset="0" stopColor="#2E2252" /><stop offset="1" stopColor="#110B21" /></radialGradient>
      </defs>
      <ellipse className="shadow" cx="120" cy="248" rx="56" ry="8" />
      <BackProps state={state} />
      <g className="body-all">
        <g className="legs"><ellipse cx="101" cy="236" rx="17" ry="10" fill={`url(#b${id})`} /><ellipse cx="139" cy="236" rx="17" ry="10" fill={`url(#b${id})`} /></g>
        <g className="arm arm-l"><line x1="92" y1="182" x2="70" y2="210" className="limb-o" /><line x1="92" y1="182" x2="70" y2="210" className="limb" /><circle cx="66" cy="215" r="7" className="hand" /></g>
        <g className="torso">
          <ellipse cx="120" cy="198" rx="36" ry="35" fill={`url(#b${id})`} />
          <circle cx="120" cy="207" r="6.5" fill="none" stroke="#CDBBEE" strokeWidth="3" /><circle cx="120" cy="207" r="2" fill="#CDBBEE" />
        </g>
        <g className="arm arm-r"><line x1="148" y1="182" x2="170" y2="210" className="limb-o" /><line x1="148" y1="182" x2="170" y2="210" className="limb" /><circle cx="174" cy="215" r="7" className="hand" /></g>
        {state === 'estudia' && <Tablet />}
        <g className="bow"><path d="M103 156 L115 161 L103 167 Z" fill="#D9B7F2" /><path d="M137 156 L125 161 L137 167 Z" fill="#D9B7F2" /><path d="M113 161 L120 155 L127 161 L120 168 Z" fill="#E7A9DB" /></g>
        <g className="head">
          <line x1="120" y1="56" x2="120" y2="38" stroke="#CDBDEB" strokeWidth="4.5" strokeLinecap="round" />
          <circle className="halo" cx="120" cy="30" r="13" />
          <circle className="bulb" cx="120" cy="30" r="7.5" />
          <rect x="45" y="92" width="15" height="38" rx="7.5" fill="#E2D2F8" /><rect x="48.5" y="99" width="8" height="24" rx="4" fill="#C6A4F4" />
          <rect x="180" y="92" width="15" height="38" rx="7.5" fill="#E2D2F8" /><rect x="183.5" y="99" width="8" height="24" rx="4" fill="#C6A4F4" />
          <ellipse cx="120" cy="110" rx="66" ry="58" fill={`url(#h${id})`} />
          <ellipse cx="120" cy="116" rx="50" ry="41" fill={`url(#v${id})`} />
          <ellipse cx="146" cy="93" rx="7" ry="4" fill="#fff" opacity=".55" transform="rotate(-28 146 93)" />
          <circle cx="156" cy="103" r="2" fill="#fff" opacity=".5" />
          <Eyes kind={EYES[state] ?? 'happy'} />
          <ellipse className="cheek" cx="88" cy="130" rx="8" ry="5" /><ellipse className="cheek" cx="152" cy="130" rx="8" ry="5" />
          {state === 'duda' && <ellipse className="mouth" cx="120" cy="137" rx="4.5" ry="4" />}
        </g>
      </g>
    </svg>
  )
}

export default Mascot
