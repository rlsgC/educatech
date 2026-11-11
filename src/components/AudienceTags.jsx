const groups = [
  ['cargos', 'Cargos'],
  ['niveles', 'Niveles educativos'],
  ['modalidades', 'Modalidades'],
  ['areas', 'Areas'],
]

function AudienceTags({ audience }) {
  return (
    <div className="audience-groups">
      {groups.map(([key, label]) => (
        <section className="audience-group" key={key}>
          <h3>{label}</h3>
          <div className="tag-row">
            {audience[key].map((item) => (
              <span className="audience-tag" key={item}>{item}</span>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default AudienceTags
