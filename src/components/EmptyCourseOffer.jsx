import { Link } from 'react-router-dom'

function EmptyCourseOffer() {
  return (
    <section className="info-panel empty-course-offer">
      <p>Ya exploraste toda la oferta disponible. Podés continuar tu formación en Mis cursos</p>
      <Link className="button" to="/mis-cursos">Ir a Mis cursos</Link>
    </section>
  )
}

export default EmptyCourseOffer
