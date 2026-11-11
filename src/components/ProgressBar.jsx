function ProgressBar({ value }) {
  return (
    <div className="progress-wrap" aria-label={`Progreso ${value}%`}>
      <div className="progress-track">
        <span className="progress-fill" style={{ width: `${value}%` }} />
      </div>
      <span>{value}%</span>
    </div>
  )
}

export default ProgressBar
