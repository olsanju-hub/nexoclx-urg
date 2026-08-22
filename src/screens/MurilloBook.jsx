import { BookOpen } from 'lucide-react';
import { murilloBook, murilloIndex, getMurilloEntriesForItem } from '../data/murilloBook.js';

const openResource = (entry) => {
  if (!entry.resourceAvailable || !entry.resource) return;
  window.open(entry.resource, '_blank', 'noopener,noreferrer');
};

export function MurilloBook({ item }) {
  const linkedEntries = item ? getMurilloEntriesForItem(item.id) : [];
  const mappedModules = new Set(murilloIndex.flatMap((entry) => entry.moduleIds)).size;
  const entriesBySection = murilloIndex.reduce((sections, entry) => {
    sections[entry.section] = [...(sections[entry.section] ?? []), entry];
    return sections;
  }, {});

  return (
    <div className="screen">
      <div className="section-heading">
        <BookOpen aria-hidden="true" size={30} strokeWidth={2} />
        <h1>Murillo 7a edicion</h1>
        <p>{murilloBook.note}</p>
      </div>

      {item ? (
        <section className="decision-result clinical-section is-destination">
          <h3>Referencia para {item.title}</h3>
          {linkedEntries.length ? (
            <div className="reference-list">
              {linkedEntries.map((entry) => (
                <button
                  className="reference-link"
                  key={`${entry.chapter}-${entry.title}`}
                  onClick={() => openResource(entry)}
                  type="button"
                >
                  <span>{entry.section}</span>
                  <strong>Cap. {entry.chapter}. {entry.title}</strong>
                  <small>
                    Pagina libro {entry.bookPage}; pagina PDF {entry.pdfPage}. Abrir capitulo fuente.
                  </small>
                </button>
              ))}
            </div>
          ) : (
            <p>No hay capitulo Murillo vinculado de forma especifica a este modulo.</p>
          )}
        </section>
      ) : (
        <section className="decision-result clinical-section is-destination">
          <h3>Indice Murillo vinculado</h3>
          <ul className="clinical-bullets">
            <li>Referencias internas preparadas para {mappedModules} modulos clinicos.</li>
            <li>Cada entrada abre el capitulo fuente disponible para verificacion secundaria.</li>
            <li>La herramienta clinica sigue estando en el protocolo NexoClx, no en este indice.</li>
          </ul>
        </section>
      )}

      {!item && (
        <div className="reference-list">
          {Object.entries(entriesBySection).map(([section, entries]) => (
            <section className="clinical-section" key={section}>
              <h3>{section}</h3>
              <div className="reference-list">
                {entries.map((entry) => (
                  <button
                    className="reference-link"
                    key={`${entry.chapter}-${entry.title}`}
                    onClick={() => openResource(entry)}
                    type="button"
                  >
                    <span>Capitulo {entry.chapter}</span>
                    <strong>{entry.title}</strong>
                    <small>Pagina libro {entry.bookPage}; pagina PDF {entry.pdfPage}. Abrir capitulo.</small>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
