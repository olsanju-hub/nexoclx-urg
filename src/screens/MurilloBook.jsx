import { BookOpen } from 'lucide-react';
import { murilloBook, murilloIndex, getMurilloEntriesForItem } from '../data/murilloBook.js';

export function MurilloBook({ item }) {
  const linkedEntries = item ? getMurilloEntriesForItem(item.id) : [];
  const mappedModules = new Set(murilloIndex.flatMap((entry) => entry.moduleIds)).size;

  return (
    <div className="screen">
      <div className="section-heading">
        <BookOpen aria-hidden="true" size={30} strokeWidth={2} />
        <h1>Murillo 7a edicion</h1>
        <p>{murilloBook.note}</p>
        <p className="reference-warning">{murilloBook.unavailableReason}</p>
      </div>

      {item ? (
        <section className="decision-result clinical-section is-destination">
          <h3>Referencia para {item.title}</h3>
          {linkedEntries.length ? (
            <div className="reference-list">
              {linkedEntries.map((entry) => (
                <article className="reference-link" key={`${entry.chapter}-${entry.title}`}>
                  <span>{entry.section}</span>
                  <strong>Cap. {entry.chapter}. {entry.title}</strong>
                  <small>Pagina libro {entry.bookPage}; pagina PDF {entry.pdfPage}; recurso no disponible en produccion.</small>
                </article>
              ))}
            </div>
          ) : (
            <p>No hay capitulo Murillo vinculado de forma especifica a este modulo.</p>
          )}
        </section>
      ) : (
        <section className="decision-result clinical-section is-destination">
          <h3>Estado del recurso</h3>
          <ul className="clinical-bullets">
            <li>Referencias internas preparadas para {mappedModules} modulos clinicos.</li>
            <li>No hay recurso Murillo autorizado configurado para visualizacion de capitulos.</li>
            <li>El icono de libro desde un protocolo muestra el capitulo Murillo correspondiente y sus paginas.</li>
          </ul>
        </section>
      )}
    </div>
  );
}
