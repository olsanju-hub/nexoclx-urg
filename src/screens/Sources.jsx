import { clinicalUpdateNotes, sourceRegistry } from '../data/urgClinicalData.js';

export function Sources() {
  return (
    <div className="screen">
      <div className="section-heading">
        <h1>Fuentes</h1>
        <p>Murillo 7a edicion define el mapa inicial; la conducta clinica se actualiza con guias oficiales vigentes.</p>
      </div>
      <section className="decision-result clinical-section">
        <h3>Jerarquia aplicada</h3>
        <ul className="clinical-bullets">
          <li>Guias y consensos oficiales mas recientes de sociedades cientificas.</li>
          <li>Protocolos institucionales actualizados cuando sean aplicables.</li>
          <li>Revisiones clinicas recientes de alta calidad.</li>
          <li>Murillo 7a edicion como estructura de base.</li>
        </ul>
      </section>
      <section className="decision-result clinical-section">
        <h3>Registro de fuentes</h3>
        <ul className="clinical-bullets">
          {sourceRegistry.map((source) => (
            <li key={source.id}>
              {source.url === '#'
                ? <span>{source.label}</span>
                : <a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>}
              {source.supports ? `: ${source.supports}` : ''}
            </li>
          ))}
        </ul>
      </section>
      <section className="decision-result clinical-section">
        <h3>Actualizaciones aplicadas</h3>
        <div className="clinical-list">
          {clinicalUpdateNotes.map((note) => (
            <article className="clinical-section" key={note.area}>
              <h4>{note.area}</h4>
              <p><strong>Murillo:</strong> {note.murillo}</p>
              <p><strong>Actualizacion:</strong> {note.update}</p>
              <p><strong>Aplicado:</strong> {note.applied}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
