function GamificationCard({ title, children, className = '' }) {
  return (
    <section className={`gamification-card ${className}`}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  )
}

export default GamificationCard
